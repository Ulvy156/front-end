import type { FormRules } from 'element-plus'

export const useAuthFormRules = () => {
  const emailRules: FormRules['email'] = [
    { required: true, message: 'Email is required', trigger: 'blur' },
    {
      validator: (_rule, value: string, callback) => {
        if (!isValidEmail(value)) callback(new Error('Enter a valid email address'))
        else callback()
      },
      trigger: 'blur',
    },
  ]

  const loginRules: FormRules = {
    email: emailRules,
    password: [
      { required: true, message: 'Password is required', trigger: 'blur' },
    ],
  }

  const registerRules: FormRules = {
    name: [
      { required: true, message: 'Full name is required', trigger: 'blur' },
    ],
    email: emailRules,
    password: [
      { required: true, message: 'Password is required', trigger: 'blur' },
      {
        validator: (_rule, value: string, callback) => {
          if (!isStrongPassword(value)) {
            callback(new Error('Must be 8+ chars with uppercase, lowercase, number, and symbol'))
          } else callback()
        },
        trigger: 'blur',
      },
    ],
  }

  return { loginRules, registerRules }
}
