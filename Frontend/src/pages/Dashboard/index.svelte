<script lang="ts">
  import { userService, socketService, productService } from '../../lib/store';
  import { onMount } from 'svelte';
  import { Container, Row, Col } from 'sveltestrap';
  import Breadcrumbs from '../../common/Breadcrumb.svelte';
  import WelcomeComp from './WelcomeComp.svelte';
  import ListProduct from './ListProduct.svelte';
  import type { MSEvent } from '../../lib/store';
  import { getToken, logout } from '../../lib/shared';
  import { MS_EVENTS, type User } from '../../lib/models';
  import { queryService } from '../../lib/store/query.service';

  $socketService.event.subscribe(async (msEvent: MSEvent) => {
    if (msEvent) {
      if (msEvent.name === MS_EVENTS.LOTOUT) {
        $socketService.close();
        await logout();
      } else if (msEvent.name === MS_EVENTS.LOGIN) {
        if (msEvent.data) {
          const { user } = msEvent.data;

          userService.update((value) => {
            value.AuthedUser = user as User;
            return value;
          });

          productService.update((value) => {
            value.init(user);
            return value;
          });

          if ($userService.AuthedUser.role === 'Admin') {
            const query = $queryService.getQueryForGroup($userService.AuthedUser.group);

            const event: MSEvent = {
              name: MS_EVENTS.REQUEST,
              data: {
                entity: 'user_entity',
                query
              }
            };

            $socketService.send(event);
          }

          const query = $queryService.getQueryForProducts($userService.AuthedUser);

          const event: MSEvent = {
            name: MS_EVENTS.REQUEST,
            data: {
              entity: 'product_entity',
              query
            }
          };

          $socketService.send(event);
        }
      } else if (msEvent.name === MS_EVENTS.RESPONSE) {
        const { result, entity } = msEvent.data;

        if (entity === 'user_entity') {
          const users = result as User[];
          userService.update((value) => {
            value.usersInGroup = users;
            return value;
          });
        }
      }
    }
  });

  $: {
    const token = getToken();
    if (token) {
      socketService.update((value) => {
        value.init(token);
        return value;
      });
    }
  }

  onMount(() => {});
</script>

<div class="page-content">
  <Container>
    <Breadcrumbs title="Dashboards" breadcrumbItem="Dashboard" />
    <Row>
      <Col xl="4">
        <WelcomeComp />
      </Col>
      <Col xl="8">
        <ListProduct />
      </Col>
    </Row>
  </Container>
</div>
