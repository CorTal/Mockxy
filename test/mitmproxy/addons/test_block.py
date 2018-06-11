from unittest import mock
import pytest

from mitmproxy.addons import block
from mitmproxy.test import taddons


@pytest.mark.parametrize("block_global, block_private, should_be_killed, address", [
    # block_global: loopback
    (True, False, False, ("127.0.0.1",)),
    (True, False, False, ("::1",)),
    # block_global: private
    (True, False, False, ("10.0.0.1",)),
    (True, False, False, ("172.20.0.1",)),
    (True, False, False, ("192.168.1.1",)),
    (True, False, False, ("::ffff:10.0.0.1",)),
    (True, False, False, ("::ffff:172.20.0.1",)),
    (True, False, False, ("::ffff:192.168.1.1",)),
    (True, False, False, ("fe80::",)),
    # block_global: global
    (True, False, True, ("1.1.1.1",)),
    (True, False, True, ("8.8.8.8",)),
    (True, False, True, ("216.58.207.174",)),
    (True, False, True, ("::ffff:1.1.1.1",)),
    (True, False, True, ("::ffff:8.8.8.8",)),
    (True, False, True, ("::ffff:216.58.207.174",)),
    (True, False, True, ("2001:4860:4860::8888",)),


    # block_private: loopback
    (False, True, False, ("127.0.0.1",)),
    (False, True, False, ("::1",)),
    # block_private: private
    (False, True, True, ("10.0.0.1",)),
    (False, True, True, ("172.20.0.1",)),
    (False, True, True, ("192.168.1.1",)),
    (False, True, True, ("::ffff:10.0.0.1",)),
    (False, True, True, ("::ffff:172.20.0.1",)),
    (False, True, True, ("::ffff:192.168.1.1",)),
    (False, True, True, ("fe80::",)),
    # block_private: global
    (False, True, False, ("1.1.1.1",)),
    (False, True, False, ("8.8.8.8",)),
    (False, True, False, ("216.58.207.174",)),
    (False, True, False, ("::ffff:1.1.1.1",)),
    (False, True, False, ("::ffff:8.8.8.8",)),
    (False, True, False, ("::ffff:216.58.207.174",)),
    (False, True, False, ("2001:4860:4860::8888",)),
])
@pytest.mark.asyncio
async def test_block_global(block_global, block_private, should_be_killed, address):
    ar = block.Block()
    with taddons.context(ar) as tctx:
        tctx.options.block_global = block_global
        tctx.options.block_private = block_private
        with mock.patch('mitmproxy.proxy.protocol.base.Layer') as layer:
            layer.client_conn.address = address
            ar.clientconnect(layer)
            if should_be_killed:
                assert layer.reply.kill.called
                assert await tctx.master.await_log("killed", "warn")
            else:
                assert not layer.reply.kill.called
