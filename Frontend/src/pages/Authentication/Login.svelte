<script lang="ts">
  import { navigate } from 'svelte-routing';
  import { Row, Col, CardBody, Card, Container, Label, Input, Button } from 'sveltestrap';
  import { Link } from 'svelte-routing';
  import { Icon } from 'sveltestrap';
  import avatar from '../../assets/images/users/avatar.svg';
  import { login, saveToken } from '../../lib/shared';
  import { productService, socketService, userService } from '../../lib/store';
  import type { User } from 'src/lib/models';

  let email = '';
  let password = '';

  const handleLoginForm = async () => {
    const response = await login(email, password);

    if (response && response.data) {
      const { data, token } = response.data;

      const authUser: User = data as User;
      userService.update((value) => {
        value.AuthedUser = authUser;
        value.usersInGroup = [];
        return value;
      });

      saveToken(token.authToken);

      productService.update((value) => {
        value.init(authUser);
        return value;
      });

      socketService.update((value) => {
        value.init(token.authToken, true);
        return value;
      });

      navigate('/dashboard');
    }
  };
</script>

<div class="home-btn d-none d-sm-block">
  <Link to="/" class="text-dark">
    <i class="bx bx-home h2" />
  </Link>
</div>
<div class="account-pages my-5 pt-sm-5">
  <Container>
    <Row class="justify-content-center">
      <Col md={8} lg={6} xl={5}>
        <Card class="overflow-hidden">
          <div class="bg-primary bg-soft">
            <Row>
              <Col class="col-7">
                <div class="text-primary p-4">
                  <h5 class="text-primary">Welcome Back !</h5>
                  <p>Sign in to continue.</p>
                </div>
              </Col>
              <Col class="col-5 align-self-end">
                <img src="src/assets/images/profile-img.png" alt="" class="img-fluid" />
              </Col>
            </Row>
          </div>
          <CardBody class="pt-0">
            <div class="auth-logo">
              <Link to="/" class="auth-logo-light">
                <div class="avatar-md profile-user-wid mb-4">
                  <span class="avatar-title rounded-circle bg-light">
                    <img src={avatar} alt="" class="rounded-circle" height="65" />
                  </span>
                </div>
              </Link>
              <Link to="/" class="auth-logo-dark">
                <div class="avatar-md profile-user-wid mb-4">
                  <span class="avatar-title rounded-circle bg-light">
                    <img src={avatar} alt="" class="rounded-circle" height="65" />
                  </span>
                </div>
              </Link>
            </div>
            <div class="p-2">
              <div class="form-horizontal">
                <div class="mb-3">
                  <Label for="email" class="form-label">Email</Label>
                  <Input type="text" class="form-control" id="email" placeholder="Enter username" bind:value={email} />
                </div>

                <div class="mb-3">
                  <Label class="form-label" for="password">Password</Label>
                  <div class="input-group auth-pass-inputgroup">
                    <Input type="password" class="form-control" id="password" placeholder="Enter password" aria-label="Password" aria-describedby="password-addon" bind:value={password} />
                    <Button color="light" type="button" id="password-addon"><Icon name="eye-fill" /></Button>
                  </div>
                </div>

                <div class="form-check">
                  <input class="form-check-input" type="checkbox" id="remember-check" />
                  <Label class="form-check-label" for="remember-check">Remember me</Label>
                </div>

                <div class="mt-3 d-grid">
                  <button class="btn btn-primary w-md waves-effect waves-light" on:click={handleLoginForm}>Log In</button>
                </div>

                <div class="mt-4 text-center">
                  <Link to="auth-recoverpw" class="text-muted"><i class="mdi mdi-lock me-1" /> Forgot your password?</Link>
                </div>
              </div>
            </div>

            <div class="mt-4 text-center">
              <span>If you have no account, please </span>
              <Link to="register" class="text-muted"><i class="mdi mdi-lock me-0" /> create one</Link>
            </div>
          </CardBody>
        </Card>
      </Col>
    </Row>
  </Container>
</div>
