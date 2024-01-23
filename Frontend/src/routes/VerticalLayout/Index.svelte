<script>
  import Header from './Header.svelte';
  import Footer from './Footer.svelte';
</script>

<div id="layout-wrapper">
  <Header />
  <div class="main-content" id="maincontent">
    <slot />
  </div>
  <Footer />
</div>
