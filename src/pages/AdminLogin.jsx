import LoginPage from './LoginPage.jsx'

export default function AdminLogin() {
  return (
    <LoginPage
      expectedRole="ADMIN"
      title="Administrator"
      subtitle="Use your admin credentials to manage accounts."
    />
  )
}
