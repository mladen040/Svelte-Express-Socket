<script>
  import { Row, Col, BreadcrumbItem } from 'sveltestrap';
  import { Link } from 'svelte-routing';

  export let title;
  export let breadcrumbItem;
</script>

<Row>
  <Col xs="12">
    <div class="page-title-box d-sm-flex align-items-center justify-content-between">
      <h4 class="mb-sm-0 font-size-18">{breadcrumbItem}</h4>
      <div class="page-title-right">
        <ol class="breadcrumb m-0">
          <BreadcrumbItem>
            <Link to="#">{title}</Link>
          </BreadcrumbItem>
          <BreadcrumbItem active>
            <Link to="#">{breadcrumbItem}</Link>
          </BreadcrumbItem>
        </ol>
      </div>
    </div>
  </Col>
</Row>
