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
export function validateFiled(rules, params) {
  const valildator = rules.map(rule => {
    return new Promise((resolve, reject) => {
      const { validator, min, max, pattern, message } = rule
      const { id, prop, value } = params
      if (typeof validator === 'function') {
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
        const Rules = {
          required: () => !value,
          min: () => len < Number(min) || len > Number(max),
          max: () => len < Number(min) || len > Number(max),
          pattern: () => !(pattern.test(value)),
          email: () => !(/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value)),
          phone: () => !(/^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/.test(value))
        }
        let e = false
        for (const key in Rules) {
          if (rule[key]) {
            e = getMessage(Rules[key](), message)
            break
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

export function validate(rows, columns, validateFiled) {
  return new Promise((resolve, reject) => {
    const rules = rows.reduce((acc, row) =>
      acc.concat(
        columns.reduce((acc, cur) => {
          const { prop, rules = [] } = cur
          return rules.length ? acc.concat(validateFiled(row, prop, rules)) : acc
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
