<script>
    import {
      Collapse,
      NavbarToggler,
      NavbarBrand,
      Nav,
      Navbar,
      NavItem,
      NavLink
    } from '@sveltestrap/sveltestrap';
    
    import LoginInfo from './LoginInfo.svelte';

    let isOpen = false;
  
    function handleUpdate(event) {
      isOpen = event.detail.isOpen;
    }
  </script>
  
  <Navbar color="primary" dark expand="md" container="md" sticky="top" fixed="top">
    <NavbarBrand href="/">Digit software</NavbarBrand>
    <NavbarToggler on:click={() => (isOpen = !isOpen)} />
    <Collapse {isOpen} navbar expand="md" on:update={handleUpdate}>
      <Nav class="ms-auto" navbar>
        <NavItem>
          <NavLink href="/artikli" on:click={()=>isOpen=false}>Артикли</NavLink>
        </NavItem>
        <NavItem>
          <NavLink href="/kontrola" on:click={()=>isOpen=false}>Контрола</NavLink>
        </NavItem>
        <NavItem>
            <LoginInfo on:click={()=>isOpen=false} />
        </NavItem>
      </Nav>
    </Collapse>
  </Navbar>