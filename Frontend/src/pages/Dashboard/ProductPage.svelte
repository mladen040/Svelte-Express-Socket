<script lang="ts">
  import type { Product } from 'src/lib/models';
  import { Card, CardBody, Modal, ModalBody, ModalFooter, Button, Icon } from 'sveltestrap';

  import ProductDetail from '../../common/ProductDetail.svelte';
  import { userService, productService } from '../../lib/store';
  import { Table } from 'sveltestrap';

  export let products: Product[] = [];

  let modal = false;
  let selected: Product;

  const selectProduct = (product: Product) => {
    selected = product;
    modal = true;
  };

  const addProduct = () => {
    const product: Product = {
      id: 0,
      userId: 0,
      userGroup: '',
      name: '',
      description: '',
      price: 0
    };
    selected = product;
    modal = true;
  };

  let deleteModal = false;
  const deleteProduct = (product: Product) => {
    deleteModal = true;
    selected = product;
  };

  const toggleDeleteModal = () => (deleteModal = !deleteModal);

  const onDeleteProduct = async () => {
    deleteModal = false;
    await $productService.deleteProduct(selected.id);
  };
</script>

<Card>
  <CardBody>
    <Table class="product-table">
      <thead class="connection-table-header">
        <tr class="align-items-end">
          {#if $userService.AuthedUser && $userService.AuthedUser.role === 'Admin'}
            <th class="w-10">
              <span class="font-size-14 text-color-mute fw-semibold"> User ID </span>
            </th>
          {/if}

          <th class="w-20">
            <span class="font-size-14 text-color-mute fw-semibold"> Name </span>
          </th>
          <!-- <th class="w-35"> -->
          <th class={`${$userService.AuthedUser && $userService.AuthedUser.role === 'Admin' ? 'w-35 text-truncate' : 'w-45 text-truncate'}`}>
            <span class="font-size-14 text-color-mute fw-semibold"> Description </span>
          </th>
          <th class="w-10">
            <span class="font-size-14 text-color-mute fw-semibold"> Price </span>
          </th>
          <th class="w-15 text-center">
            <span class="font-size-14 text-color-mute fw-semibold"> Edit </span>
          </th>
          <th class="w-10 text-center">
            <Button class="pt-0 pb-1" outline color="info" on:click={addProduct}>
              <span class="font-size-14">Add</span>
            </Button>
          </th>
        </tr>
      </thead>

      <tbody>
        {#each products as product, i}
          <tr class={i % 2 === 0 ? 'odd' : 'even'}>
            {#if $userService.AuthedUser && $userService.AuthedUser.role === 'Admin'}
              <td class="w-10 text-truncate">
                <span class="align-middle">{product.userId}</span>
              </td>
            {/if}

            <td class="w-20 text-truncate">
              <span class="text-truncate">
                {product.name}
              </span>
            </td>

            <td class={`${$userService.AuthedUser && $userService.AuthedUser.role === 'Admin' ? 'w-35 text-truncate' : 'w-45 text-truncate'}`}>
              <span class="text-truncate">
                {product.description}
              </span>
            </td>
            <td class="w-10 text-truncate">
              <span class="text-truncate">
                {product.price}
              </span>
            </td>
            <td class="w-15 d-flex justify-content-center">
              <button class="d-flex w-100 btn-edit" on:click={() => selectProduct(product)}>
                <span class="fw-semibold font-size-16">Edit</span>
              </button>
            </td>
            <td class="w-10 d-flex justify-content-center">
              <Button class="py-1" color="danger" on:click={() => deleteProduct(product)}>
                <Icon name="trash" />
              </Button>
            </td>
          </tr>

          <tr class={`table-row-mobile ${i % 2 === 0 ? 'odd' : 'even'}`}>
            <td class="w-70 d-flex justify-content-start align-items-center">
              <div class="ms-2 product-info">
                <span class="label-name text-truncate">{`${product.name}`}</span>
                <span class="label-description text-truncate">{product.description}</span>
                <span class="label-description text-truncate">{product.price}</span>
              </div>
            </td>

            <td class="w-30 d-flex justify-content-center">
              <button class="d-flex w-100 btn-edit" on:click={() => selectProduct(product)}>
                <span class="fw-semibold font-size-14">Edit</span>
              </button>

              <!-- svelte-ignore a11y-click-events-have-key-events -->
              <div class="py-2 px-4" on:click={() => deleteProduct(product)}>
                <Icon name="trash" />
              </div>
            </td>
          </tr>
        {/each}
      </tbody>
    </Table>
  </CardBody>
</Card>

<ProductDetail bind:modal product={selected} />

<Modal isOpen={deleteModal} autoFocus={true} centered={true} toggle={toggleDeleteModal}>
  <div class="modal-content border-bottom-0">
    <div class="modal-header">
      <h5 class="modal-title">Delete Product</h5>
      <button type="button" class="btn-close" on:click={toggleDeleteModal} data-bs-dismiss="modal" aria-label="Close" />
    </div>

    <ModalBody class="d-flex justify-content-center">
      <h4 class="my-4">Are you sure?</h4>
    </ModalBody>
    <ModalFooter>
      <Button type="button" color="danger" on:click={onDeleteProduct}>DELETE</Button>
    </ModalFooter>
  </div>
</Modal>
