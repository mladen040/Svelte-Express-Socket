<script>
  import { userService } from '../lib/store';
  import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'sveltestrap';
  import avatar from '../assets/images/users/avatar.svg';
  import { clearAll, logout } from '../lib/shared';
  import { navigate } from 'svelte-routing';

  const handleLogOut = async () => {
    await logout();
    clearAll();

    navigate('/login');
  };
</script>

{#if $userService.AuthedUser}
  <Dropdown class="dropdown d-inline-block">
    <DropdownToggle class="btn header-item headerbtn" id="page-header-user-dropdown" tag="button" color="">
      <img class="rounded-circle header-profile-user" src={avatar} alt="Header Avatar" />
      <span class="d-none d-xl-inline-block ms-1"> {$userService.AuthedUser.email} </span>
      <i class="mdi mdi-chevron-down d-none d-xl-inline-block" />
    </DropdownToggle>

    <DropdownMenu class="dropdown-menu-end">
      <h6 class="dropdown-header">Welcome</h6>
      <DropdownItem href={'/contacts-profile'}
        ><i class="mdi mdi-account-circle text-muted font-size-16 align-middle me-1" />
        <span class="align-middle">Profile</span>
      </DropdownItem>

      <div class="dropdown-divider" />
      <DropdownItem on:click={handleLogOut}
        ><i class="mdi mdi-logout text-muted font-size-16 align-middle me-1" />
        <span class="align-middle">Logout</span>
      </DropdownItem>
    </DropdownMenu>
  </Dropdown>
{/if}
