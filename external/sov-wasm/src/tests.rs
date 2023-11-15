use core::slice;

use super::*;

const CALL: &str = r#"{"bank":{"Freeze":{"token_address":"sov1lta047h6lta047h6lta047h6lta047h6lta047h6lta047h6ltaq5s0rwf"}}}"#;
const NONCE: [u8; 8] = [30, 143, 51, 152, 179, 131, 30, 213];
const PUBLIC: [u8; 32] = [
    30, 198, 13, 80, 237, 238, 3, 226, 25, 89, 8, 43, 65, 224, 72, 89, 205, 64, 129, 30, 37, 74, 7,
    224, 51, 94, 78, 158, 8, 138, 252, 50,
];
const SIGNATURE: [u8; 64] = [
    111, 42, 155, 230, 10, 59, 66, 203, 85, 90, 165, 42, 57, 104, 234, 55, 96, 38, 249, 78, 166,
    252, 215, 255, 100, 182, 89, 37, 236, 3, 251, 139, 15, 8, 65, 231, 30, 220, 36, 244, 131, 46,
    49, 85, 246, 42, 79, 213, 238, 141, 194, 123, 10, 108, 61, 56, 49, 238, 24, 166, 138, 146, 86,
    12,
];
const MSG: [u8; 42] = [
    0, 4, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250,
    250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 30, 143, 51, 152, 179,
    131, 30, 213,
];
const TX: [u8; 142] = [
    111, 42, 155, 230, 10, 59, 66, 203, 85, 90, 165, 42, 57, 104, 234, 55, 96, 38, 249, 78, 166,
    252, 215, 255, 100, 182, 89, 37, 236, 3, 251, 139, 15, 8, 65, 231, 30, 220, 36, 244, 131, 46,
    49, 85, 246, 42, 79, 213, 238, 141, 194, 123, 10, 108, 61, 56, 49, 238, 24, 166, 138, 146, 86,
    12, 30, 198, 13, 80, 237, 238, 3, 226, 25, 89, 8, 43, 65, 224, 72, 89, 205, 64, 129, 30, 37,
    74, 7, 224, 51, 94, 78, 158, 8, 138, 252, 50, 34, 0, 0, 0, 0, 4, 250, 250, 250, 250, 250, 250,
    250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250,
    250, 250, 250, 250, 250, 250, 250, 30, 143, 51, 152, 179, 131, 30, 213,
];

fn take_bytes(ptr: usize) -> Vec<u8> {
    let ptr = ptr as *mut u8;
    let len = unsafe { slice::from_raw_parts(ptr, 4) };
    let len: [u8; 4] = len.try_into().unwrap();
    let len = u32::from_le_bytes(len) as usize;
    unsafe { Vec::from_raw_parts(ptr, len + 4, len + 4).split_off(4) }
}

#[test]
fn test_serialize_call() {
    let call_ptr = CALL.as_ptr() as usize;
    let call_len = CALL.len();
    let nonce_ptr = NONCE.as_ptr() as usize;

    let message_ptr = serialize_call(call_ptr, call_len, nonce_ptr);
    let message = take_bytes(message_ptr);

    assert_eq!(&message, &MSG);
}

#[test]
fn test_serialize_transaction() {
    let pk_ptr = PUBLIC.as_ptr() as usize;
    let pk_len = PUBLIC.len();
    let msg_ptr = MSG.as_ptr() as usize;
    let msg_len = MSG.len();
    let sig_ptr = SIGNATURE.as_ptr() as usize;
    let sig_len = SIGNATURE.len();

    let tx_ptr = serialize_transaction(pk_ptr, pk_len, msg_ptr, msg_len, sig_ptr, sig_len);
    let tx = take_bytes(tx_ptr);

    assert_eq!(&tx, &TX);
}

#[test]
fn test_validate_transaction() {
    let tx_ptr = TX.as_ptr() as usize;
    let tx_len = TX.len();

    assert_eq!(0, validate_transaction(tx_ptr, tx_len));
}
