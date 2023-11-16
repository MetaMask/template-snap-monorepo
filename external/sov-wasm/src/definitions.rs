pub type Context = sov_modules_api::default_context::ZkDefaultContext;
pub type DaSpec = sov_mock_da::MockDaSpec;
pub type RuntimeCall = demo_stf::runtime::RuntimeCall<Context, DaSpec>;
