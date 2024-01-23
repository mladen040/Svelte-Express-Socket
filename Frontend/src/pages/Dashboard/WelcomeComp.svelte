<script>
  import { Row, Col, Card, CardBody, CardHeader } from 'sveltestrap';
  import { userService } from '../../lib/store';
</script>

<Card class="overflow-hidden">
  <div class="bg-primary bg-soft">
    <Row>
      <Col xs="7">
        <div class="text-primary p-3">
          <h5 class="text-primary">Welcome Back !</h5>
          <p>Challenge Dashboard</p>
        </div>
      </Col>
      <Col xs="5" class="align-self-end">
        <img src="/src/assets/images/profile-img.png" alt="" class="img-fluid" />
      </Col>
    </Row>
  </div>
  <CardBody class="pt-0">
    <Row>
      <div class="avatar-md profile-user-wid">
        <img src="/src/assets/images/users/avatar.svg" alt="avatar-1" class="img-thumbnail rounded-circle" />
      </div>

      {#if $userService.AuthedUser}
        <h5 class="font-size-15 text-truncate">{`${$userService.AuthedUser.firstName} ${$userService.AuthedUser.lastName}`}</h5>
        <p class="text-muted mb-0 text-truncate">{`User Id: ${$userService.AuthedUser.id}`}</p>
        <p class="text-muted mb-0 text-truncate">{`User Role: ${$userService.AuthedUser.role}`}</p>
        <p class="text-muted mb-0 text-truncate">{`User Group: ${$userService.AuthedUser.group}`}</p>
      {/if}
    </Row>
  </CardBody>
</Card>

{#if $userService.AuthedUser && $userService.AuthedUser.role === 'Admin'}
  <Card>
    <CardHeader>{`Users In ${$userService.AuthedUser.group} Group`}</CardHeader>
    <CardBody class="px-0">
      {#each $userService.usersInGroup as user}
        <div class="px-2 my-2 d-flex justify-content-start">
          <span class="font-size-15 text-truncate mx-2">{`${user.id}.`}</span>
          <span class="font-size-15 text-truncate">{`${user.email}`}</span>
        </div>
      {/each}
    </CardBody>
  </Card>
{/if}
