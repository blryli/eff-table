import { getType } from './'
/**
 * 校验规则
 */
// class Rule {
//   constructor(rule) {
//     Object.assign(this, {
//       $options: rule,
//       required: rule.required,
//       min: rule.min,
//       max: rule.max,
//       type: rule.type,
//       pattern: rule.pattern,
//       validator: rule.validator,
//       trigger: rule.trigger,
//       maxWidth: rule.maxWidth
//     })
//   }
// }

function getMessage(rule, message) {
  return rule ? message : false
}
/**
 * 字段校验
 */
export function validateField(rules, params) {
  const hasRequire = rules.find(v => v.required)

  const valildator = rules.map(rule => {
    return new Promise((resolve, reject) => {
      const { validator, min, max, pattern, message } = rule
      const { id, prop, value } = params
      const isNoValue = value === null || value === undefined || value === ''
      if (typeof validator === 'function') {
        if (isNoValue) {
          params.value = ''
          if (!hasRequire) {
            resolve({ id, prop, message: false })
          }
        }

        const valid = validator(params)
        if (getType(valid) === 'Promise') {
          valid.then(message => {
            resolve({ id, prop, message })
          }).catch(e => reject(e))
        } else {
          resolve({ id, prop, message: valid })
        }
      } else {
        const len = ('' + value).length
        const minMaxMessage = `${min && max ? '长度必须在' + min + '到' + max : min ? '长度不能小于' + min : max ? '长度不能大于' + max : ''}个字符`
        const validRules = [
          { type: 'required', rule: () => isNoValue, message: `不能为空` },
          { type: 'min', rule: () => len < Number(min) || len > Number(max), message: minMaxMessage },
          { type: 'max', rule: () => len < Number(min) || len > Number(max), message: minMaxMessage },
          { type: 'pattern', rule: () => !(pattern.test(value)), message: `校验不通过` },
          { type: 'email', rule: () => !(/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value)), message: `请输入正确的邮箱` },
          { type: 'phone', rule: () => !(/^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/.test(value)), message: `请输入正确的手机号` }
        ]
        let e = false
        const valid = validRules.find(valid => (valid.type === 'required' ? rule.required : Object.keys(rule).includes(valid.type)) || rule.type === valid.type)
        // console.log('validate', JSON.stringify({ rule, valid }, null, 2))
        if (valid) {
          e = getMessage(valid.rule(), message || valid.message || '校验不通过')
          if (valid.type !== 'required' && !hasRequire && isNoValue) {
            e = false
          }
        }
        resolve({ id, prop, message: e })
      }
    })
  })
  return Promise.all(valildator).then(res => res.find(d => d.message) || {})
}

/**
 * 通用校验
 */

export function validate(rows, columns, validateField) {
  return new Promise((resolve, reject) => {
    const rules = rows.reduce((acc, row) =>
      acc.concat(
        columns.reduce((acc, cur) => {
          const { prop, rules = [] } = cur
          return rules.length ? acc.concat(validateField(prop, rules, row)) : acc
        }, [])
      ),
    [])
    Promise.all(rules).then(data => {
      const messages = data.filter(d => d.message)
      if (!messages.length) {
        resolve(true)
      } else {
        reject(messages)
      }
    }).catch(err => {
      reject(err)
    })
  })
}
