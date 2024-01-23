<script lang="ts">
  import type { NOTIFY_INFO, Product, ProductItem } from '../../lib/models';
  import { productService, queryService } from '../../lib/store';
  import { paginate, LightPaginationNav } from '../../common/pagination';
  import ProductPage from './ProductPage.svelte';
  import { onMount } from 'svelte';
  import { socketService, userService } from '../../lib/store';
  import { MS_EVENTS } from '../../lib/models';
  import type { MSEvent } from '../../lib/store';

  let productItems: ProductItem[] = [];
  let currentPage = 1;
  const pageSize = 8;

  let paginatedItems;
  let viewing = '';
  let wasMounted = false;

  productService.subscribe((value) => {
    productItems = [];

    if (value.products && value.products.length > 0) {
      value.products.sort((a, b) => {
        return a.id - b.id;
      });

      value.products.forEach((product, i) => {
        const productItem = {
          ...product,
          index: i
        };

        productItems.push(productItem);
      });

      if (wasMounted) {
        updatePaginate(productItems);
      }
    }
  });

  const updatePaginate = (products: ProductItem[]) => {
    paginatedItems = paginate(products, pageSize, currentPage);
    if (paginatedItems.length > 0) {
      const start = paginatedItems[0].index + 1;
      const end = paginatedItems[paginatedItems.length - 1].index + 1;
      viewing = 'Viewing ' + start + '-' + end + ' of ' + products.length;
    }
  };

  const onSetPage = (pageIdx: number) => {
    currentPage = pageIdx;
    updatePaginate(productItems);
  };

  $: {
    if (wasMounted) {
      if (productItems && productItems.length > 0) {
        updatePaginate(productItems);
      }
    }
  }

  $socketService.event.subscribe(async (msEvent: MSEvent) => {
    if (msEvent) {
      if (msEvent.name === MS_EVENTS.NOTIFY_UPDATED) {
        const info: NOTIFY_INFO = msEvent.data as NOTIFY_INFO;

        if (info.entity === 'ProductEntity') {
          if (info.name !== 'refresh') {
            productService.update((value) => {
              value.onNotify(info);
              return value;
            });
          } else {
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
        }
      } else if (msEvent.name === MS_EVENTS.RESPONSE) {
        const { result, entity } = msEvent.data;

        if (entity === 'product_entity') {
          const products = result as Product[];

          productService.update((value) => {
            value.products = products;
            return value;
          });
        }
      }
    }
  });

  onMount(() => {
    wasMounted = true;
  });
</script>

<ProductPage bind:products={paginatedItems} />

<div class="mx-0 custom-pagination-container">
  <div class="text-container-up">
    <span class="mx-4 font-size-16 fw-semibold">{viewing}</span>
  </div>

  {#if productItems.length > 0}
    <div data-testid="test_id_recommended_list_pagination" class="d-flex justify-content-center align-items-center my-2">
      <LightPaginationNav totalItems={productItems.length} {pageSize} {currentPage} limit={1} showStepOptions={true} on:setPage={(e) => onSetPage(e.detail.page)} />
    </div>
  {/if}

  <div class="text-container-down">
    <span class="mx-4 py-4 font-size-16 fw-semibold">{viewing}</span>
  </div>
</div>
