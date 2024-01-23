<script lang="ts">
  import { navigate } from 'svelte-routing';
  import { Container, Row, Col, Card, CardBody } from 'sveltestrap';
  import { Link } from 'svelte-routing';
  import { register } from '../../lib/shared';
  import { UserGroupOptions, UserRoleOptions, type UserDto, type UserGroup, type UserRole } from '../../lib/models';

  let firstName = '';
  let lastName = '';
  let email = '';
  let password = '';
  let role: UserRole;
  let group: UserGroup;

  const handleRegisterForm = async () => {
    if (firstName !== '' && lastName !== '' && email !== '' && role !== null && group !== null && password !== '') {
      const body: UserDto = {
        firstName,
        lastName,
        email,
        role,
        group,
        password
      };

      const response = await register(body);

      if (response && response.data) {
        navigate('/login');
      }
    }
  };

  const onChangeUserRole = (e) => {
    role = UserRoleOptions[e.target.selectedIndex].value;
  };

  const onChangeUserGroup = (e) => {
    group = UserGroupOptions[e.target.selectedIndex].value;
  };
</script>

<div class="account-pages my-5 pt-sm-5">
  <Container>
    <Row class="justify-content-center">
      <Col md={8} lg={8} xl={5}>
        <Card class="overflow-hidden">
          <div class="bg-primary bg-soft">
            <Row>
              <Col class="col-7">
                <div class="text-primary p-4">
                  <h5 class="text-primary">Free Register</h5>
                  <p>Get your free account now.</p>
                </div>
              </Col>
              <Col class="col-5 align-self-end">
                <img src="src/assets/images/profile-img.png" alt="" class="img-fluid" />
              </Col>
            </Row>
          </div>
          <CardBody class="pt-0">
            <div>
              <Link to="/">
                <div class="avatar-md profile-user-wid mb-4">
                  <span class="avatar-title rounded-circle bg-light">
                    <img src="src/assets/images/users/avatar.svg" alt="" class="rounded-circle" height="65" />
                  </span>
                </div>
              </Link>
            </div>
            <div class="p-2">
              <form on:submit|preventDefault={handleRegisterForm}>
                <div class="mb-3">
                  <label for="firstname" class="form-label">First Name</label>
                  <input type="text" name="firstname" class="form-control" id="firstname" bind:value={firstName} placeholder="Enter First Name" />
                  <div class="invalid-feedback">Please Enter First Name</div>
                </div>

                <div class="mb-3">
                  <label for="lastname" class="form-label">Last Name</label>
                  <input type="text" name="lastname" class="form-control" id="lastname" bind:value={lastName} placeholder="Enter Last Name" />
                  <div class="invalid-feedback">Please Enter Last Name</div>
                </div>

                <div class="mb-3">
                  <label for="role" class="form-label">User Role</label>
                  <!-- <input type="text" name="role" class="form-control" id="role" bind:value={role} placeholder="Enter User Role" /> -->

                  <div class="user-role-selector">
                    <div class="input-group">
                      <select class="form-select" value="0" on:change={(e) => onChangeUserRole(e)}>
                        {#each UserRoleOptions as item, index}
                          <option value={index + 1}>{item.value}</option>
                        {/each}
                      </select>
                    </div>
                  </div>

                  <div class="invalid-feedback">Please Enter User Role</div>
                </div>

                <div class="mb-3">
                  <label for="role" class="form-label">User Group</label>
                  <!-- <input type="text" name="role" class="form-control" id="role" bind:value={role} placeholder="Enter User Role" /> -->

                  <div class="user-role-selector">
                    <div class="input-group">
                      <select class="form-select" value="0" on:change={(e) => onChangeUserGroup(e)}>
                        {#each UserGroupOptions as item, index}
                          <option value={index + 1}>{item.value}</option>
                        {/each}
                      </select>
                    </div>
                  </div>

                  <div class="invalid-feedback">Please Enter User Group</div>
                </div>

                <div class="mb-3">
                  <label for="useremail" class="form-label">Email</label>
                  <input type="email" name="email" class="form-control" id="email" bind:value={email} placeholder="Enter Email" />
                  <div class="invalid-feedback">Please Enter Email</div>
                </div>

                <div class="mb-3">
                  <label for="userpassword" class="form-label">Password</label>
                  <input type="password" name="password" class="form-control" id="password" bind:value={password} placeholder="Enter Password" />
                  <div class="invalid-feedback">Please Enter Password</div>
                </div>

                <div class="mt-4 d-grid">
                  <button class="btn btn-primary w-md waves-effect waves-light" type="submit">Register</button>
                </div>
              </form>

              <div class="mt-4 text-center">
                <span>If you have your account, please </span>
                <Link to="login" class="text-muted"><i class="mdi mdi-lock me-0" />login</Link>
              </div>
            </div>
          </CardBody>
        </Card>
      </Col>
    </Row>
  </Container>
</div>
