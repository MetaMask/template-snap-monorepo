#![no_std]

extern crate alloc;

use alloc::vec::Vec;
use core::{mem, slice};

use borsh::{BorshDeserialize, BorshSerialize};
use sov_modules_api::Signature as _;

mod definitions;
use definitions::{Context, RuntimeCall};

pub type PublicKey = <Context as sov_modules_api::Spec>::PublicKey;
pub type Signature = <Context as sov_modules_api::Spec>::Signature;
pub type Transaction = sov_modules_api::transaction::Transaction<Context>;

#[cfg(test)]
mod tests;

/// Allocates memory into the module.
#[no_mangle]
pub fn alloc(len: usize) -> usize {
    let mut buf: Vec<u8> = Vec::with_capacity(len);
    let ptr = buf.as_mut_ptr();
    mem::forget(buf);
    ptr as usize
}

/// Deallocates memory from the module.
#[no_mangle]
pub fn dealloc(ptr: usize, len: usize) {
    let data = unsafe { Vec::from_raw_parts(ptr as *mut u8, len, len) };
    mem::drop(data);
}

/// Deallocates an array from the memory of the module.
#[no_mangle]
pub fn dealloc_array(ptr: usize) {
    let len = unsafe { slice::from_raw_parts(ptr as *const u8, 4) };
    let mut len_bytes = [0u8; 4];
    len_bytes.copy_from_slice(len);
    let len = u32::from_le_bytes(len_bytes) as usize;
    let data = unsafe { Vec::from_raw_parts(ptr as *mut u8, len, len) };
    mem::drop(data);
}

/// Computes a call message to be signed, and serializes it using borsh.
///
/// # Arguments
///
/// * `call_ptr` - Pointer to the JSON representation of the call message.
/// * `call_len` - Length of the call message.
/// * `nonce_ptr` - Pointer to the nonce, a [u64] little-endian representation.
///
/// # Returns
///
/// Returns a pointer to an array of bytes containing the [u32] little-endian representation of the
/// length of the message, followed by the message.
///
/// If, for example the message is `[1, 2, 3]`, the pointer will address the bytes
/// `[3, 0, 0, 0, 1, 2, 3]`.
///
/// # Errors
///
/// Will return `0` if:
///
/// * The JSON representation is invalid.
/// * The message serialization failed.
#[no_mangle]
pub fn serialize_call(call_ptr: usize, call_len: usize, nonce_ptr: usize) -> usize {
    let (call_ptr, call_len) = (call_ptr as *const u8, call_len as usize);
    let (nonce_ptr, nonce_len) = (nonce_ptr as *const u8, 8usize);
    let (call, nonce) = unsafe {
        (
            slice::from_raw_parts(call_ptr, call_len),
            slice::from_raw_parts(nonce_ptr, nonce_len),
        )
    };
    let call: RuntimeCall = match serde_json::from_slice(&call) {
        Ok(c) => c,
        Err(_) => return 0,
    };

    let mut bytes: Vec<u8> = Vec::new();
    if call.serialize(&mut bytes).is_err() {
        return 0;
    }

    let mut result = Vec::with_capacity(12 + bytes.len());
    result.extend_from_slice(&(bytes.len() as u32 + 8).to_le_bytes());
    result.extend_from_slice(&bytes);
    result.extend_from_slice(nonce);
    let ptr = result.as_ptr();

    // forget the vector so it will remain in-memory after execution
    mem::forget(result);
    ptr as usize
}

/// Serializes the provided arguments into a sequencer transaction.
///
/// # Arguments
///
/// * `pk_ptr` - Pointer to the bytes representation of the public key.
/// * `pk_len` - Length of the public key.
/// * `msg_ptr` - Pointer to the bytes representation of the message generated via [serialize_call].
/// * `msg_len` - Length of the message.
/// * `sig_ptr` - Pointer to the bytes representation of the signature.
/// * `sig_len` - Length of the signature.
///
/// # Returns
///
/// Returns a pointer to an array of bytes containing the [u32] little-endian representation of the
/// length of the serialized transaction, followed by the message.
///
/// If, for example the transaction is `[1, 2, 3]`, the pointer will address the bytes
/// `[3, 0, 0, 0, 1, 2, 3]`.
///
/// # Errors
///
/// Will return `0` if:
///
/// * The message length is invalid.
/// * The public key is invalid.
/// * The signature is invalid.
/// * The transaction serialization failed.
#[no_mangle]
pub fn serialize_transaction(
    pk_ptr: usize,
    pk_len: usize,
    msg_ptr: usize,
    msg_len: usize,
    sig_ptr: usize,
    sig_len: usize,
) -> usize {
    if msg_len < 8 {
        return 0;
    }

    let (pk_ptr, pk_len) = (pk_ptr as *const u8, pk_len as usize);
    let (msg_ptr, msg_len) = (msg_ptr as *const u8, msg_len as usize);
    let (sig_ptr, sig_len) = (sig_ptr as *const u8, sig_len as usize);
    let (pk, msg, sig) = unsafe {
        (
            slice::from_raw_parts(pk_ptr, pk_len),
            slice::from_raw_parts(msg_ptr, msg_len),
            slice::from_raw_parts(sig_ptr, sig_len),
        )
    };

    let pk = match PublicKey::try_from(pk) {
        Ok(p) => p,
        Err(_) => return 0,
    };

    let (call, nonce) = msg.split_at(msg.len() - 8);
    let call = call.to_vec();
    let mut nonce_bytes = [0u8; 8];
    nonce_bytes.copy_from_slice(nonce);
    let nonce = u64::from_le_bytes(nonce_bytes);

    let sig = match Signature::try_from(sig) {
        Ok(s) => s,
        Err(_) => return 0,
    };

    let tx = Transaction::new(pk, call, sig, nonce);
    let mut bytes: Vec<u8> = Vec::new();
    if tx.serialize(&mut bytes).is_err() {
        return 0;
    }

    let mut result = Vec::with_capacity(4 + bytes.len());
    result.extend_from_slice(&(bytes.len() as u32).to_le_bytes());
    result.extend_from_slice(&bytes);
    let ptr = result.as_ptr();

    // forget the vector so it will remain in-memory after execution
    mem::forget(result);
    ptr as usize
}

/// Validates the provided transaction, checking its signature.
///
/// # Arguments
///
/// * `ptr` - Pointer to the borsh representation of the transaction.
/// * `len` - Length of the transaction.
///
/// # Returns
///
/// Returns `0` if the transaction is valid.
///
/// # Errors
///
/// * `-1` if the borsh representation is invalid.
/// * `-2` if the signature is invalid.
#[no_mangle]
pub fn validate_transaction(ptr: usize, len: usize) -> i32 {
    let (ptr, len) = (ptr as *const u8, len as usize);
    let mut tx = unsafe { slice::from_raw_parts(ptr, len) };
    let tx = match Transaction::deserialize(&mut tx) {
        Ok(t) => t,
        Err(_) => return -1,
    };

    let mut msg = Vec::with_capacity(tx.runtime_msg().len() + 8);
    msg.extend_from_slice(tx.runtime_msg());
    msg.extend_from_slice(&tx.nonce().to_le_bytes());

    if tx.signature().verify(&tx.pub_key(), &msg).is_err() {
        return -2;
    }

    return 0;
}
