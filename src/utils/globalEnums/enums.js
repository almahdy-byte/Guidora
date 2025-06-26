

export const Roles = {
    USER : 'user',
    ADMIN : 'admin',
}
Object.freeze(Roles);


export const Providers = {
    GOOGLE:'google',
    SYSTEM:'system'
}
Object.freeze(Providers);


export const tokenTypes = {
    ACCESS:'access',
    REFRESH:'refresh'
}
Object.freeze(tokenTypes);

export const Gender = {
    MALE : 'male',
    FEMALE : 'female'
}
Object.freeze(Gender)

export const OTPTypes = {
    CONFIRM_EMAIL:'confirmEmail',
    FORGET_PASSWORD:'forgetPassword'
}
Object.freeze(OTPTypes);

export const subjects={
    CONFIRM_EMAIL:"Confirm Email",
    RESET_PASSWORD:"Reset Password",
    ACCEPT_APP :'ACCEPTED',
    REJECT_APP :'REJECTED',
    SEND_APP:'new application',
    CANCEL_APP :'cancel app'
}
Object.freeze(subjects);

export const FileType={
    IMAGE:['image/apng' , 'image/jpeg' , 'image/png'],
    VIDEO:[],
    PDF:['application/pdf']
}
Object.freeze(FileType)

export const AppStatus={
    Pending :'pending',
    ACCEPTED:'accepted',
    REJECTED:'rejected',
    CANCELED : 'canceled'
}

Object.freeze(AppStatus)

export const PlaceCategory = {
    PHARONIC: 'pharonic',
    ISLAMIC: 'islamic',
    COPTIC: 'coptic',
    MODERN: 'modern',
    NATURAL: 'natural',
    BEACH: 'beach',
    DESERT: 'desert',
    CULTURAL: 'cultural',
    ENTERTAINMENT: 'entertainment',
    THERAPEUTIC: 'therapeutic', // للأماكن العلاجية زي سيوة
  };
  
  Object.freeze(PlaceCategory);
  