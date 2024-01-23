<script lang="ts">
  import { Router, Route } from 'svelte-routing';
  import data from './routes';
  import Layout from './routes/Layout.svelte';
  import { navigate } from 'svelte-routing';
  import { getToken } from './lib/shared';
  import { onMount } from 'svelte';

  export let url = '';

  onMount(() => {
    if (!getToken()) {
      navigate('/login');
    } else {
      navigate('/dashboard');
    }
  });
</script>

<Router {url}>
  {#each data.publicRoutes as route}
    <Route path={route.path}>
      <svelte:component this={route.component} />
    </Route>
  {/each}

  {#each data.authProtectedRoutes as route}
    <Route path={route.path} let:params>
      <Layout>
        <svelte:component this={route.component} />
      </Layout>
    </Route>
  {/each}
</Router>
