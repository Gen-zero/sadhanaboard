import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import '@/styles/admin-login.css'
import { Shield, Key } from 'lucide-react'
import { adminApi } from '@/services/adminApi'

const schema = z.object({
  username: z.string().min(3, 'Enter a valid username'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type FormData = z.infer<typeof schema>

const AdminLoginForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    setError(null)
    try {
      await adminApi.login(data.username, data.password)
      window.location.href = '/admin'
    } catch (e: any) {
      setError(e?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="admin-login-form space-y-4 p-6">
      {error && <div className="admin-error" role="alert">{error}</div>}

      <label className="block">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"><Shield className="w-4 h-4" /></span>
          <Input className="admin-input pl-10" placeholder="Admin username" {...register('username')} aria-invalid={!!errors.username} />
        </div>
        {errors.username && <p className="text-xs text-red-400 mt-1">{errors.username.message}</p>}
      </label>

      <label className="block">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"><Key className="w-4 h-4" /></span>
          <Input type="password" className="admin-input pl-10" placeholder="Password" {...register('password')} aria-invalid={!!errors.password} />
        </div>
        {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password.message}</p>}
      </label>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">Two-factor enforced via admin settings</div>
        <Button type="submit" className="admin-login-button" disabled={loading}>
          {loading ? <span className="cosmic-spinner w-4 h-4 inline-block mr-2" /> : null}
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>
      </div>
    </form>
  )
}

export default AdminLoginForm
