<script>
  import VerticalLayout from '../routes/VerticalLayout/Index.svelte';

  let layoutType = 'vertical';

  let component = VerticalLayout;

  if (layoutType == 'horizontal') {
    document.body.setAttribute('data-layout', 'horizontal');
  }
</script>

<svelte:component this={component}>
  <slot />
</svelte:component>
