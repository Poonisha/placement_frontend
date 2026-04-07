import LoginPage from './LoginPage.jsx'

export default function StudentLogin() {
  return (
    <LoginPage
      expectedRole="STUDENT"
      title="Student"
      subtitle="Use your student credentials to view jobs and apply."
    />
  )
}
