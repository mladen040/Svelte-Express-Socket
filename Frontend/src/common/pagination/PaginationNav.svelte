<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import generateNavigationOptions from './generateNavigationOptions';
  import { SymbolTypes, OptionTypes } from './symbol-types';

  const dispatch = createEventDispatcher();

  export let totalItems = 0;
  export let pageSize = 1;
  export let currentPage = 1;
  export let limit = null;
  export let showStepOptions = false;

  $: options = generateNavigationOptions({ totalItems, pageSize, currentPage, limit, showStepOptions });
  $: totalPages = Math.ceil(totalItems / pageSize);

  function handleOptionClick(option) {
    dispatch('setPage', { page: option.value });
  }
</script>

<div class="pagination-nav">
  {#each options as option}
    <span
      class="option"
      class:number={option.type === OptionTypes.Number}
      class:prev={option.type === OptionTypes.Symbol && option.symbol === SymbolTypes.PREVIOUS_PAGE}
      class:next={option.type === OptionTypes.Symbol && option.symbol === SymbolTypes.NEXT_PAGE}
      class:disabled={(option.type === OptionTypes.Symbol && option.symbol === SymbolTypes.NEXT_PAGE && currentPage >= totalPages) || (option.type === OptionTypes.Symbol && option.symbol === SymbolTypes.PREVIOUS_PAGE && currentPage <= 1)}
      class:ellipsis={option.type === OptionTypes.Symbol && option.symbol === SymbolTypes.ELLIPSIS}
      class:active={option.type === OptionTypes.Number && option.value === currentPage}
      on:click={() => handleOptionClick(option)}
    >
      {#if option.type === OptionTypes.Number}
        <slot name="number" value={option.value}>
          <span>{option.value}</span>
        </slot>
      {:else if option.type === OptionTypes.Symbol && option.symbol === SymbolTypes.ELLIPSIS}
        <slot name="ellipsis">
          <span>...</span>
        </slot>
      {:else if option.type === OptionTypes.Symbol && option.symbol === SymbolTypes.PREVIOUS_PAGE}
        <slot name="prev">
          <svg style="width:24px;height:24px" viewBox="0 0 24 24">
            <path fill="#000000" d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z" />
          </svg>
        </slot>
      {:else if option.type === OptionTypes.Symbol && option.symbol === SymbolTypes.NEXT_PAGE}
        <slot name="next">
          <svg style="width:24px;height:24px" viewBox="0 0 24 24">
            <path fill="#000000" d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
          </svg>
        </slot>
      {/if}
    </span>
  {/each}
</div>
