<template>
  <div class="validate-input-container pb-3">
    <input class="form-control"
           :class="{'is-invalid': inputRef.error}"
           v-if="tag !== 'textarea'"
           @blur="validateInput"
           v-model="inputRef.value"
           v-bind="$attrs">
    <textarea
      v-else
      class="form-control"
      :class="{'is-invalid': inputRef.error}"
      @blur="validateInput"
      v-model="inputRef.value"
      v-bind="$attrs">
    </textarea>
    <span v-if="inputRef.error" class="invalid-feedback">{{ inputRef.message }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, PropType, onMounted, computed } from 'vue'
import { emitter } from './ValidateForm.vue'

const emailReg = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/

interface RuleProp {
  type: 'required' | 'email' | 'password' | 'custom';
  message: string;
  validator?: () => boolean;
}

export type RulesProp = RuleProp[]
export type TagType = 'input' | 'textarea'
export default defineComponent({
  props: {
    rules: Array as PropType<RulesProp>,
    modelValue: String,
    tag: {
      type: String as PropType<TagType>,
      default: 'input'
    }
  },
  inheritAttrs: false,
  setup (props, context) {
    console.log(context.attrs)
    const inputRef = reactive({
      value: computed({
        get: () => props.modelValue || '',
        set: val => {
          context.emit('update:modelValue', val)
        }
      }),
      error: false,
      message: ''
    })
    const validateInput = () => {
      if (props.rules) {
        const allPassed = props.rules.every(rule => {
          let passed = true
          inputRef.message = rule.message
          switch (rule.type) {
            case 'required':
              passed = (inputRef.value.trim() !== '')
              break
            case 'email':
              passed = emailReg.test(inputRef.value)
              break
            case 'custom':
              passed = rule.validator ? rule.validator() : true
              break
            default:
              break
          }
          return passed
        })
        inputRef.error = !allPassed
        return allPassed
      }
      return true
    }
    onMounted(() => {
      emitter.emit('form-item-created', validateInput)
    })
    return {
      inputRef,
      validateInput
    }
  }
})
</script>

<style></style>
