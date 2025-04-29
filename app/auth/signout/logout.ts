export function Logout() {
  fetch("/auth/signout",{method:"POST"});
}
