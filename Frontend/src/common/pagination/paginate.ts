export default function (items: any[], pageSize: number, currentPage: number) {
  return items.slice((currentPage - 1) * pageSize, (currentPage - 1) * pageSize + pageSize);
}
