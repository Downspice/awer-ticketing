export default async function UserData() {
  const { data } = await supabase.auth.getUser();
  return { data };
}
