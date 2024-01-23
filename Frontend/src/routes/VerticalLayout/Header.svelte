<script lang="ts">
  import ProfileMenu from '../../common/ProfileMenu.svelte';

  function tToggle() {
    var body = document.body;

    body.classList.toggle('sidebar-enable');
    body.classList.toggle('vertical-collpsed');

    if (window.innerWidth >= 992) {
      if (body.getAttribute('data-sidebar-size') == 'sm') {
        body.setAttribute('data-sidebar-size', 'lg');
      } else {
        body.setAttribute('data-sidebar-size', 'sm');
      }
    }
  }
</script>

<header id="page-topbar">
  <div class="navbar-header">
    <div class="d-flex">
      <div class="navbar-brand-box">
        <a href="index" class="logo logo-dark">
          <span class="logo-sm">
            <img src="/src/assets/svelte.svg" alt="" height="40" />
          </span>
          <span class="logo-lg">
            <img src="/src/assets/svelte.svg" alt="" height="36" />
          </span>
        </a>

        <a href="index" class="logo logo-light">
          <span class="logo-sm">
            <img src="/src/assets/svelte.svg" alt="" height="40" />
          </span>
          <span class="logo-lg">
            <img src="/src/assets/svelte.svg" alt="" height="36" />
          </span>
        </a>
      </div>

      <button class="btn btn-sm px-3 font-size-16 vertinav-toggle header-item waves-effect" id="vertical-menu-btn" on:click={tToggle}>
        <i class="fa fa-fw fa-bars" />
      </button>
    </div>

    <div class="d-flex">
      <ProfileMenu />
    </div>
  </div>
</header>
