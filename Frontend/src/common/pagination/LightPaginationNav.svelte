<script lang="ts">
  import PaginationNav from './PaginationNav.svelte';
</script>

<div class="light-pagination-nav">
  <PaginationNav {...$$props} on:setPage />
</div>
