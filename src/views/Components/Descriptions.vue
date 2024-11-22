<script setup lang="tsx">
import { Descriptions } from '@/components/Descriptions'
import { useI18n } from '@/hooks/web/useI18n'
import { reactive } from 'vue'
import { Form } from '@/components/Form'
import { ElFormItem, ElInput } from 'element-plus'
import { useValidator } from '@/hooks/web/useValidator'
import { useForm } from '@/hooks/web/useForm'
import { DescriptionsSchema } from '@/components/Descriptions'

const { required } = useValidator()

const { t } = useI18n()

const data = reactive({
  userId: '12345678',
  username: 'chenkl',
  nickName: '梦似花落。',
  age: 26,
  phone: '13655971xxxx',
  email: '502431556@qq.com',
  addr: '这是一个很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长的地址',
  sex: '男',
  certy: '3505831994xxxxxxxx'
})

const schema = reactive<DescriptionsSchema[]>([
  {
    field: 'userId',
    label: t('descriptionsDemo.userId')
  },
  {
    field: 'username',
    label: t('descriptionsDemo.username')
  },
  {
    field: 'phone',
    label: t('descriptionsDemo.phone')
  }
])

const schema2 = reactive<DescriptionsSchema[]>([
  {
    field: 'userId',
    label: t('descriptionsDemo.userId'),
    slots: {
      label: (row) => {
        return <span class="is-required--item">{row.label}</span>
      },
      default: () => {
        return (
          <ElFormItem prop="userId">
            <ElInput v-model={form.userId} />
          </ElFormItem>
        )
      }
    }
  },
  {
    field: 'username',
    label: t('descriptionsDemo.username'),
    slots: {
      label: (row) => {
        return <span class="is-required--item">{row.label}</span>
      },
      default: () => {
        return (
          <ElFormItem prop="username">
            <ElInput v-model={form.username} />
          </ElFormItem>
        )
      }
    }
  },
  {
    field: 'phone',
    label: t('descriptionsDemo.phone'),
    slots: {
      label: (row) => {
        return <span class="is-required--item">{row.label}</span>
      },
      default: () => {
        return (
          <ElFormItem prop="phone">
            <ElInput v-model={form.phone} />
          </ElFormItem>
        )
      }
    }
  }
])

const form = reactive({
  userId: '',
  username: '',
  nickName: '',
  phone: '',
  email: '',
  addr: ''
})

const rules = reactive({
  userId: [required()],
  username: [required()],
  nickName: [required()],
  phone: [required()],
  email: [required()],
  addr: [required()]
})

const { formRegister, formMethods } = useForm()
const { getElFormExpose } = formMethods

const formValidation = async () => {
  const elFormExpose = await getElFormExpose()
  elFormExpose?.validate((isValid) => {
    console.log(isValid)
  })
}
</script>

<template>
  <Descriptions
    :title="t('descriptionsDemo.descriptions')"
    :message="t('descriptionsDemo.descriptionsDes')"
    :data="data"
    :schema="schema"
  />

  <Form is-custom :model="form" :rules="rules" @register="formRegister">
    <Descriptions
      :title="t('descriptionsDemo.form')"
      :data="data"
      :schema="schema2"
      class="mt-20px"
    />
    <div class="text-center mt-10px">
      <BaseButton @click="formValidation"> {{ t('formDemo.formValidation') }} </BaseButton>
    </div>
  </Form>
</template>

<style lang="less" scoped>
:deep(.is-required--item) {
  position: relative;

  &::before {
    margin-right: 4px;
    color: var(--el-color-danger);
    content: '*';
  }
}
</style>
