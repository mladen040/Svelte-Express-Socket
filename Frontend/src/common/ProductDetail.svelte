<script lang="ts">
  import type { Product, ProductDto, UserIdOptionType } from 'src/lib/models';
  import { Modal, ModalBody, ModalFooter, Button } from 'sveltestrap';
  import { userService } from '../lib/store';
  import { productService } from '../lib/store';
  export let modal = false;
  export let product: Product;

  const togglemodal = () => (modal = !modal);

  let ids: UserIdOptionType[] = [];
  let selectedIdx = 0;

  userService.subscribe((value) => {
    if (value.AuthedUser && value.usersInGroup) {
      ids = [];

      value.usersInGroup.forEach((user) => {
        ids.push({
          id: ids.length,
          value: user.id,
          email: user.email
        });
      });
    }
  });

  $: {
    if (product) {
      selectedIdx = ids.findIndex((item) => item.value === product.userId);
    }
  }

  const onChangeUserId = (e) => {
    const id = ids[e.target.selectedIndex].value;
    product.userId = id;
  };

  const onClickUpdate = async () => {
    modal = false;

    if ($userService.AuthedUser) {
      const body: ProductDto = {
        name: product.name,
        userId: product.userId > 0 ? product.userId : $userService.AuthedUser.id,
        userGroup: $userService.AuthedUser.group,
        description: product.description,
        price: product.price
      };

      if (product.id > 0) {
        await $productService.updateProduct(product.id, body);
      } else {
        if (body.name !== '' && body.description !== '' && body.price !== 0) {
          await $productService.createProduct(body);
        }
      }
    }
  };
</script>

<Modal isOpen={modal} autoFocus={true} centered={true} toggle={togglemodal}>
  <div class="modal-content border-bottom-0">
    <div class="modal-header">
      <h5 class="modal-title">{`Product Details: ${$userService.AuthedUser.group}`}</h5>
      <button type="button" class="btn-close" on:click={togglemodal} data-bs-dismiss="modal" aria-label="Close" />
    </div>

    <ModalBody>
      <form>
        {#if $userService.AuthedUser.role === 'Admin'}
          <div class="mb-3">
            <label for="userid" class="form-label">User ID</label>
            <div class="user-role-selector">
              <div class="input-group">
                <select class="form-select" bind:value={selectedIdx} on:change={(e) => onChangeUserId(e)}>
                  {#each ids as idItem, index}
                    <option value={index}>{`id : ${idItem.value},  email : ${idItem.email}`}</option>
                  {/each}
                </select>
              </div>
            </div>
          </div>
        {/if}

        <div class="mb-3">
          <label for="name" class="form-label">Product Name</label>
          <input type="text" name="productname" class="form-control" id="productname" bind:value={product.name} placeholder="Product Name" />
          <div class="invalid-feedback">Please Enter Product Name</div>
        </div>

        <div class="mb-3">
          <label for="description" class="form-label">Description</label>
          <input type="text" name="description" class="form-control" id="description" bind:value={product.description} placeholder="Description" />
          <div class="invalid-feedback">Please Enter Description</div>
        </div>

        <div class="mb-3">
          <label for="price" class="form-label">Price</label>
          <input type="number" name="price" class="form-control" id="price" bind:value={product.price} placeholder="Enter Price" />
          <div class="invalid-feedback">Please Enter Price</div>
        </div>
      </form>
    </ModalBody>
    <ModalFooter>
      <Button type="button" outline color="info" on:click={onClickUpdate}>{product.id > 0 ? 'Update' : 'Add'}</Button>
    </ModalFooter>
  </div>
</Modal>
