import { getType } from './'
/**
 * 校验规则
 */
class Rule {
  constructor(rule) {
    Object.assign(this, {
      $options: rule,
      required: rule.required,
      min: rule.min,
      max: rule.max,
      type: rule.type,
      pattern: rule.pattern,
      validator: rule.validator,
      trigger: rule.trigger,
      maxWidth: rule.maxWidth
    })
  }
}
/**
 * 字段校验
 */

export function validateFiled(rules, params) {
  return new Promise((resolve, reject) => {
    rules.map(rule => {
      const { validator } = rule
      if (typeof validator === 'function') {
        const valid = validator(params)
        const { id, prop } = params
        if (getType(valid) === 'Promise') {
          valid.then(message => {
            resolve({ id, prop, message })
          }).catch(e => reject(e))
        } else {
          resolve({ id, prop, message: valid })
        }
      }
    })
  })
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
