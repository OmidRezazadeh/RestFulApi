const Joi = require('joi');

exports.productSchema= Joi.object({
    name:Joi.string().required().min(4).max(12).messages({
        'any.required':'لطفا نام محصول را وارد کنید',
        'string.min': 'نام محصول باید حداقل 4 کاراکتر باشد',
        'string.max': 'نام محصول نمی‌تواند بیشتر از 12 کاراکتر باشد',
    }),
    price: Joi.number()
        .required()
        .messages({
            'number.base': 'لطفا یک عدد معتبر برای قیمت وارد کنید',
            'any.required': 'لطفا قیمت را وارد کنید',
        }),
    image: Joi.string().required()
        .messages({
            'string.base': 'لطفا یک رشته معتبر برای تصویر وارد کنید',
            'any.required':'لطفا   تصویر را وارد کنید',
        }),
    quantity:Joi.number().required().messages({
        'number.base': 'لطفا یک عدد معتبر برای  تعداد وارد کنید',
        'any.required': 'لطفا تعداد را وارد کنید',
    })
})