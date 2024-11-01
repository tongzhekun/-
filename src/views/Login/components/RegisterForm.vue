<script setup lang="tsx">
import { ElMessage } from 'element-plus'
import { Form, FormSchema } from '@/components/Form'
import { registerApi } from '@/api/login'
import { reactive, ref } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { useForm } from '@/hooks/web/useForm'
import { FormRules } from 'element-plus'
import { useValidator } from '@/hooks/web/useValidator'
import { BaseButton } from '@/components/Button'
import { IAgree } from '@/components/IAgree'
import { RegisterUserType } from '@/api/login/types'

const emit = defineEmits(['to-login'])

const { formRegister, formMethods } = useForm()
const { getFormData, getElFormExpose } = formMethods

const { t } = useI18n()

const { required, check } = useValidator()

// const getCodeTime = ref(60)
// const getCodeLoading = ref(false)
// const getCode = () => {
//   getCodeLoading.value = true
//   const timer = setInterval(() => {
//     getCodeTime.value--
//     if (getCodeTime.value <= 0) {
//       clearInterval(timer)
//       getCodeTime.value = 60
//       getCodeLoading.value = false
//     }
//   }, 1000)
// }

const schema = reactive<FormSchema[]>([
  {
    field: 'title',
    colProps: {
      span: 24
    },
    formItemProps: {
      slots: {
        default: () => {
          return <h2 class="text-2xl font-bold text-center w-[100%]">{t('login.register')}</h2>
        }
      }
    }
  },
  {
    field: 'userId',
    label: t('login.userId'),
    value: '',
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      placeholder: t('login.userIdPlaceholder')
    }
  },
  {
    field: 'username',
    label: t('login.username'),
    value: '',
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      placeholder: t('login.usernamePlaceholder')
    }
  },
  {
    field: 'password',
    label: t('login.password'),
    value: '',
    component: 'InputPassword',
    colProps: {
      span: 24
    },
    componentProps: {
      style: {
        width: '100%'
      },
      strength: true,
      placeholder: t('login.passwordPlaceholder')
    }
  },
  {
    field: 'check_password',
    label: t('login.checkPassword'),
    value: '',
    component: 'InputPassword',
    colProps: {
      span: 24
    },
    componentProps: {
      style: {
        width: '100%'
      },
      strength: true,
      placeholder: t('login.passwordPlaceholder')
    }
  },
  // {
  //   field: 'code',
  //   label: t('login.code'),
  //   colProps: {
  //     span: 24
  //   },
  //   formItemProps: {
  //     slots: {
  //       default: (formData) => {
  //         return (
  //           <div class="w-[100%] flex">
  //             <ElInput v-model={formData.code} placeholder={t('login.codePlaceholder')} />
  //             <BaseButton
  //               type="primary"
  //               disabled={unref(getCodeLoading)}
  //               class="ml-10px"
  //               onClick={getCode}
  //             >
  //               {t('login.getCode')}
  //               {unref(getCodeLoading) ? `(${unref(getCodeTime)})` : ''}
  //             </BaseButton>
  //           </div>
  //         )
  //       }
  //     }
  //   }
  // },

  {
    field: 'iAgree',
    colProps: {
      span: 24
    },
    formItemProps: {
      slots: {
        default: (formData: any) => {
          return (
            <>
              <IAgree
                v-model={formData.iAgree}
                text="我同意《用户协议》"
                link={[
                  {
                    text: '《用户协议》',
                    url: 'https://element-plus.org/'
                  }
                ]}
              />
            </>
          )
        }
      }
    }
  },
  {
    field: 'register',
    colProps: {
      span: 24
    },
    formItemProps: {
      slots: {
        default: () => {
          return (
            <>
              <div class="w-[100%]">
                <BaseButton
                  type="primary"
                  class="w-[100%]"
                  loading={loading.value}
                  onClick={loginRegister}
                >
                  {t('login.register')}
                </BaseButton>
              </div>
              <div class="w-[100%] mt-15px">
                <BaseButton class="w-[100%]" onClick={toLogin}>
                  {t('login.hasUser')}
                </BaseButton>
              </div>
            </>
          )
        }
      }
    }
  }
])

const rules: FormRules = {
  userId: [required()],
  username: [required()],
  password: [required()],
  check_password: [required()],
  code: [required()],
  iAgree: [required(), check()]
}

const toLogin = () => {
  emit('to-login')
}

const loading = ref(false)

const loginRegister = async () => {
  const formRef = await getElFormExpose()
  const formData = await getFormData<RegisterUserType>()
  formRef?.validate(async (valid) => {
    if (valid) {
      if (formData.password == formData.check_password) {
        try {
          loading.value = true
          try {
            const res = await registerApi(formData)
            if (res.data.code === 200) {
              ElMessage.success('注册成功')
              toLogin()
            } else {
              ElMessage.error('注册失败')
            }
          } catch (error) {
            ElMessage.error('注册失败')
            // 这里可以更新 UI，显示错误信息
          } finally {
            loading.value = false
          }
        } finally {
          loading.value = false
        }
      } else {
        ElMessage.warning('密码和确认密码不一致，请重新输入')
      }
    }
  })
}
</script>

<template>
  <Form
    :schema="schema"
    :rules="rules"
    label-position="top"
    hide-required-asterisk
    size="large"
    class="dark:(border-1 border-[var(--el-border-color)] border-solid)"
    @register="formRegister"
  />
</template>
