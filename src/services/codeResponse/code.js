const RESPONSE_CODE = {}

// 3rd party integration
RESPONSE_CODE[RESPONSE_CODE["MOMO_0"] = "0"] = "Momo create payment success"
RESPONSE_CODE[RESPONSE_CODE["MOMO_9043"] = "9043"] = "Momo user not connected to bank"
RESPONSE_CODE[RESPONSE_CODE["MOMO_99"] = "99"] = "Momo system error"
RESPONSE_CODE[RESPONSE_CODE["MOMO_49"] = "49"] = "Momo user cancel transaction"
RESPONSE_CODE[RESPONSE_CODE["MOMO_7"] = "7"] = "Momo transaction pending"
RESPONSE_CODE[RESPONSE_CODE["MOMO_29"] = "29"] = "Momo system maintainer"
RESPONSE_CODE[RESPONSE_CODE["MOMO_32"] = "32"] = "Momo transaction done"
RESPONSE_CODE[RESPONSE_CODE["MOMO_36"] = "36"] = "Momo transaction timeout"
RESPONSE_CODE[RESPONSE_CODE["MOMO_37"] = "37"] = "Momo transaction limit"
RESPONSE_CODE[RESPONSE_CODE["ZALO_1"] = 1] = "Zalo create payment success"
RESPONSE_CODE[RESPONSE_CODE["ZALO_2"] = 2] = "Zalo create payment failed"
RESPONSE_CODE[RESPONSE_CODE["ZALO_SUB_RETURN_CODE_-406"] = -406] = "User wallet reaches a fund-in limitation."
RESPONSE_CODE[RESPONSE_CODE["ZALO_SUB_RETURN_CODE_-401"] = -401] = "Dữ liệu yêu cầu không hợp lệ"

// system
RESPONSE_CODE[RESPONSE_CODE["SYSTEM_ERROR"] = "5000"] = "Unknown error from server"

// auth
RESPONSE_CODE[RESPONSE_CODE["AUTH_TOKEN_INVALID"] = "AUTH_4000"] = "Token invalid"

// user
RESPONSE_CODE[RESPONSE_CODE["USER_REGISTER_SUCCESS"] = "USER_REGISTER_2000"] = "User register successful"

//admin
RESPONSE_CODE[RESPONSE_CODE["SYSTEM_REGISTER_SUCCESS"] = "SYSTEM_2000"] = "System register successful"

// top up
RESPONSE_CODE[RESPONSE_CODE["TOP_UP_RECEIVE_NOT_FOUND"] = "TOP_UP_4000"] = "receiver not found"

export default RESPONSE_CODE
