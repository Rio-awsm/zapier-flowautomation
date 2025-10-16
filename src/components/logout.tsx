"use client"
import { authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from './ui/button'

const Logout = () => {
  const router = useRouter()
  return (
    <Button onClick={() => authClient.signOut({
      fetchOptions : {
        onSuccess: () => {
          toast.message("Logged out")
          router.push("/login")
        }
      }
    })}>
      Logout
    </Button>
  )
}

export default Logout
