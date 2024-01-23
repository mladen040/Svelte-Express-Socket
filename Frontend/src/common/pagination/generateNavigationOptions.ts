import { OptionTypes, SymbolTypes } from './symbol-types';

export default function ({ totalItems, pageSize, currentPage, limit, showStepOptions = false }) {
  const totalPages = Math.ceil(totalItems / pageSize);
  const limitThreshold = getLimitThreshold({ limit });

  const limited = limit && totalPages > limitThreshold;

  let options = limited ? generateLimitedOptions({ totalPages, limit, currentPage }) : generateUnlimitedOptions({ totalPages });
  return showStepOptions ? addStepOptions({ options, currentPage, totalPages }) : options;
}

function generateUnlimitedOptions({ totalPages }) {
  return new Array(totalPages)
    .fill({
      type: OptionTypes.Number,
      value: 0
    })
    .map((value, index) => ({
      type: OptionTypes.Number,
      value: index + 1
    }));
}

function generateLimitedOptions({ totalPages, limit, currentPage }) {
  const boundarySize = limit * 2 + 2;
  const firstBoundary = 1 + boundarySize;
  const lastBoundary = totalPages - boundarySize;
  const totalShownPages = firstBoundary + 2;

  if (currentPage <= firstBoundary - limit) {
    return Array(totalShownPages)
      .fill({ type: OptionTypes.Number, value: 0 })
      .map((value, index) => {
        if (index === totalShownPages - 1) {
          return {
            type: OptionTypes.Number,
            value: totalPages
          };
        } else if (index === totalShownPages - 2) {
          return {
            type: OptionTypes.Symbol,
            symbol: SymbolTypes.ELLIPSIS,
            value: firstBoundary + 1
          };
        }
        return {
          type: OptionTypes.Number,
          value: index + 1
        };
      });
  } else if (currentPage >= lastBoundary + limit) {
    return Array(totalShownPages)
      .fill({
        type: OptionTypes.Number,
        value: 0
      })
      .map((value, index) => {
        if (index === 0) {
          return {
            type: OptionTypes.Number,
            value: 1
          };
        } else if (index === 1) {
          return {
            type: OptionTypes.Symbol,
            symbol: SymbolTypes.ELLIPSIS,
            value: lastBoundary - 1
          };
        }
        return {
          type: OptionTypes.Number,
          value: lastBoundary + index - 2
        };
      });
  }

  return Array(totalShownPages)
    .fill({
      type: OptionTypes.Number,
      value: 0
    })
    .map((value, index) => {
      if (index === 0) {
        return {
          type: OptionTypes.Number,
          value: 1
        };
      } else if (index === 1) {
        return {
          type: OptionTypes.Symbol,
          symbol: SymbolTypes.ELLIPSIS,
          value: currentPage - limit + (index - 2)
        };
      } else if (index === totalShownPages - 1) {
        return {
          type: OptionTypes.Number,
          value: totalPages
        };
      } else if (index === totalShownPages - 2) {
        return {
          type: OptionTypes.Symbol,
          symbol: SymbolTypes.ELLIPSIS,
          value: currentPage + limit + 1
        };
      }
      return {
        type: OptionTypes.Number,
        value: currentPage - limit + (index - 2)
      };
    });
}

function addStepOptions({ options, currentPage, totalPages }) {
  return [
    {
      type: OptionTypes.Symbol,
      symbol: SymbolTypes.PREVIOUS_PAGE,
      value: currentPage <= 1 ? 1 : currentPage - 1
    },
    ...options,
    {
      type: OptionTypes.Symbol,
      symbol: SymbolTypes.NEXT_PAGE,
      value: currentPage >= totalPages ? totalPages : currentPage + 1
    }
  ];
}

function getLimitThreshold({ limit }) {
  const maximumUnlimitedPages = 3; // This means we cannot limit 3 pages or less
  const numberOfBoundaryPages = 2; // The first and last pages are always shown
  return limit * 2 + maximumUnlimitedPages + numberOfBoundaryPages;
}
