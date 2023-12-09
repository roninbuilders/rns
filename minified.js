function S(e, n) {
  let t = 0,
    r = {};
  for (let o of e) {
    let { result: i, consumed: u } = l(o, n, t);
    (t += u), (r[o.name || "result"] = i);
  }
  return r;
}
function l(e, n, t) {
  return (
    P(e, n, t) ||
    M(e, n, t) ||
    T(e, n, t) ||
    C(e, n, t) ||
    U(e, n, t) ||
    F(e, n, t) ||
    $(e, n, t) ||
    $(e, n, t) ||
    V(e, n, t) ||
    _(e, n, t) ||
    j(e, n, t) ||
    O(e, n, t) ||
    (function () {
      throw new Error(`Unsupported parameter type ${e.type}`);
    })()
  );
}
function P(e, n, t) {
  let r = /^(.*)\[(\d+)\]$/.exec(e.type);
  if (r === null) return null;
  let o = Object.assign({}, e, { type: r[1] }),
    i = Number.parseInt(r[2], 10);
  if (x(o)) {
    let u = Number(a(n.subarray(t, t + 32))),
      s = [],
      c = 0;
    for (let d = 0; d < i; ++d) {
      let { result: f, consumed: E } = l(o, n.subarray(u), c);
      (c += E), s.push(f);
    }
    return { result: s, consumed: c };
  } else {
    let u = [],
      s = 0;
    for (let c = 0; c < i; ++c) {
      let { result: d, consumed: f } = l(o, n, t + s);
      (s += f), u.push(d);
    }
    return { result: u, consumed: s };
  }
}
function M(e, n, t) {
  if (!e.type.endsWith("[]")) return null;
  let r = e.type.substring(0, e.type.length - 2),
    o = Object.assign({}, e, { type: r }),
    i = Number(a(n.subarray(t, t + 32))),
    u = Number(a(n.subarray(i, i + 32))),
    s = [],
    c = 0;
  for (let d = 0; d < u; ++d) {
    let { result: f, consumed: E } = l(o, n.subarray(i + 32), c);
    (c += E), s.push(f);
  }
  return { result: s, consumed: 32 };
}
function T(e, n, t) {
  if (e.type !== "tuple") return null;
  let r = {},
    o = 0;
  if (!(e.components === void 0 || e.components.length === 0))
    if (N(e.components)) {
      let i = Number(a(n.subarray(t, t + 32)));
      for (let u of e.components) {
        let { result: s, consumed: c } = l(u, n.subarray(i), o);
        (o += c), (r[u.name] = s);
      }
      o = 32;
    } else
      for (let i of e.components) {
        let { result: u, consumed: s } = l(i, n, t + o);
        (o += s), (r[i.name] = u);
      }
  return { result: r, consumed: o };
}
function C(e, n, t) {
  if (e.type !== "bytes") return null;
  let r = Number(a(n.subarray(t, t + 32))),
    o = Number(a(n.subarray(r, r + 32)));
  return { result: n.subarray(r + 32, r + 32 + o), consumed: 32 };
}
function U(e, n, t) {
  if (e.type !== "string") return null;
  let r = Number(a(n.subarray(t, t + 32))),
    o = Number(a(n.subarray(r, r + 32))),
    i = n.subarray(r + 32, r + 32 + o);
  return { result: new TextDecoder().decode(i), consumed: 32 };
}
function F(e, n, t) {
  if (e.type !== "bool") return null;
  let r = n.subarray(t, t + 32);
  return { result: !!(a(r) !== 0n), consumed: 32 };
}
function $(e, n, t) {
  let r = /^(u?)int(\d*)$/.exec(e.type);
  if (r === null) return null;
  let o = Number.parseInt(r[2]);
  if (o <= 0 || o > 256 || o % 8) return null;
  let i = !r[1],
    u = n.subarray(t, t + 32),
    s = a(u, i);
  if (!i && s >= 2n ** BigInt(o))
    throw new Error(
      `Encoded number is bigger than the expected size.  Expected smaller than ${
        2n ** BigInt(o)
      }, but decoded ${s}.`
    );
  if (i && s >= 2n ** BigInt(o - 1))
    throw new Error(
      `Encoded number is bigger than the expected size.  Expected smaller than ${
        2n ** BigInt(o - 1)
      }, but decoded ${s}.`
    );
  if (i && s < -(2n ** BigInt(o - 1)))
    throw new Error(
      `Encoded number is bigger (negative) than the expected size.  Expected smaller (negative) than -${
        2n ** BigInt(o - 1)
      }, but decoded ${s}.`
    );
  return { result: s, consumed: 32 };
}
function V(e, n, t) {
  if (e.type !== "address") return null;
  let r = n.subarray(t, t + 32),
    o = a(r);
  if (o >= 2n ** 160n)
    throw new Error(
      `Encoded value is bigger than the largest possible address.  Decoded value: 0x${o.toString(
        16
      )}.`
    );
  return { result: o, consumed: 32 };
}
function _(e, n, t) {
  let r = /^bytes(\d+)$/.exec(e.type);
  if (r === null) return null;
  let o = Number.parseInt(r[1]);
  if (o < 1 || o > 32)
    throw new Error(
      `Can only decode fixed length bytes values between 1 and 32 bytes.  Receivede 'bytes${o}'.`
    );
  let i = n.subarray(t, t + o),
    u = a(i),
    s = n.subarray(t + o, t + 32);
  if (s.some((c) => c !== 0))
    throw new Error(
      `Encoded value contains extraneous unexpected bytes.  Extraneous bytes: 0x${Array.from(
        s
      )
        .map((c) => c.toString(16).padStart(2, "0"))
        .join("")}.`
    );
  return { result: u, consumed: 32 };
}
function j(e, n, t) {
  if (!/^u?fixed\d+x\d+$/.test(e.type)) return null;
  throw new Error(`Encoding an EVM type ${e.type} is not supported`);
}
function O(e, n, t) {
  if (e.type !== "function") return null;
  throw new Error(`Decoding an EVM type ${e.type} is not supported`);
}
function A(e, n) {
  if (e.length !== n.length)
    throw new Error(
      `Number of provided parameters (${n.length}) does not match number of expected parameters (${e.length})`
    );
  let t = n.map((r, o) => h(e[o], r));
  return g(t);
}
function h(e, n) {
  return (
    z(e, n) ||
    J(e, n) ||
    W(e, n) ||
    H(e, n) ||
    Z(e, n) ||
    k(e, n) ||
    L(e, n) ||
    q(e, n) ||
    G(e, n) ||
    K(e) ||
    Q(e) ||
    (function () {
      throw new Error(`Unsupported parameter type ${e.type}`);
    })()
  );
}
function z(e, n) {
  let t = /^(.*)\[(\d+)\]$/.exec(e.type);
  if (t === null) return null;
  let r = Number.parseInt(t[2]);
  if (!Array.isArray(n) || n.length !== r)
    throw new Error(`Can only encode a JavaScript 'array' of length ${r} into an EVM 'array' of length ${r}
${n}`);
  let o = Object.assign({}, e, { type: t[1] }),
    i = n.map((s) => h(o, s)),
    u = i.some((s) => s.isDynamic);
  return u
    ? { isDynamic: u, bytes: g(i) }
    : { isDynamic: u, bytes: p(i.map((s) => s.bytes)) };
}
function J(e, n) {
  if (!e.type.endsWith("[]")) return null;
  if (!Array.isArray(n))
    throw new Error(`Can only encode a JavaScript 'array' into an EVM 'array'
${n}`);
  let t = Object.assign({}, e, {
      type: e.type.substring(0, e.type.length - 2),
    }),
    r = n.map((i) => h(t, i)),
    o = y(r.length);
  return { isDynamic: !0, bytes: p([o, g(r)]) };
}
function W(e, n) {
  if (e.type !== "tuple") return null;
  if (typeof n != "object")
    throw new Error(`Can only encode a JavaScript 'object' or a JavaScript array into an EVM 'tuple'
${n}`);
  if (e.components === void 0 || e.components.length === 0)
    return { isDynamic: !1, bytes: new Uint8Array(0) };
  {
    let t = n,
      r = e.components.map((i, u) => {
        let s = Y(t) ? t[u] : t[i.name];
        return h(i, s);
      }),
      o = r.some((i) => i.isDynamic);
    return { isDynamic: o, bytes: o ? g(r) : p(r.map((i) => i.bytes)) };
  }
}
function H(e, n) {
  if (e.type !== "bytes") return null;
  if (!(n instanceof Uint8Array))
    throw new Error(`Can only encode a JavaScript 'Uint8Array' into EVM 'bytes'
${n}`);
  return { isDynamic: !0, bytes: B(n) };
}
function Z(e, n) {
  if (e.type !== "string") return null;
  if (typeof n != "string")
    throw new Error(`Can only encode a JavaScript 'string' into an EVM 'string'
${n}`);
  let t = new TextEncoder().encode(n);
  return { isDynamic: !0, bytes: B(t) };
}
function k(e, n) {
  if (e.type !== "bool") return null;
  if (typeof n != "boolean")
    throw new Error(`Can only encode JavaScript 'boolean' into EVM 'bool'
${n}`);
  let t = new Uint8Array(32);
  return t.set([n ? 1 : 0], 31), { isDynamic: !1, bytes: t };
}
function L(e, n) {
  let t = /^(u?)int(\d*)$/.exec(e.type);
  if (t === null) return null;
  if (typeof n != "bigint")
    throw new Error(`Can only encode a JavaScript 'bigint' into an EVM '${e.type}'
${n}`);
  let r = Number.parseInt(t[2]);
  if (r <= 0 || r > 256 || r % 8)
    throw new Error(
      "EVM numbers must be in range [8, 256] and must be divisible by 8."
    );
  let o = !t[1];
  if (!o && n >= 2n ** BigInt(r))
    throw new Error(
      `Attempted to encode ${n} into a ${e.type}, but it is too big to fit.`
    );
  if (!o && n < 0n)
    throw new Error(
      `Attempted to encode ${n} into a ${e.type}, but you cannot encode negative numbers into a ${e.type}.`
    );
  if (o && n >= 2n ** BigInt(r - 1))
    throw new Error(
      `Attempted to encode ${n} into a ${e.type}, but it is too big to fit.`
    );
  if (o && n < -(2n ** BigInt(r - 1)))
    throw new Error(
      `Attempted to encode ${n} into a ${e.type}, but it is too big (of a negative number) to fit.`
    );
  return { isDynamic: !1, bytes: y(n, 32, o) };
}
function q(e, n) {
  if (e.type !== "address") return null;
  if (typeof n != "bigint")
    throw new Error(`Can only encode JavaScript 'bigint' into EVM 'address'
${n}`);
  if (n > 0xffffffffffffffffffffffffffffffffffffffffn)
    throw new Error(
      `Attempted to encode 0x${n.toString(
        16
      )} into an EVM address, but it is too big to fit.`
    );
  if (n < 0n)
    throw new Error(
      `Attempted to encode ${n} into an EVM address, but addresses must be positive numbers.`
    );
  return { isDynamic: !1, bytes: X(y(n, 20)) };
}
function G(e, n) {
  let t = /^bytes(\d+)$/.exec(e.type);
  if (t === null) return null;
  let r = Number.parseInt(t[1]);
  if (typeof n != "bigint")
    throw new Error(`Can only encode JavaScript 'bigint' into EVM 'bytes${r}'
${n}`);
  if (n >= 2n ** BigInt(r * 8))
    throw new Error(
      `Attempted to encode 0x${n.toString(16)} into an EVM ${
        e.type
      }, but it is too big to fit.`
    );
  if (n < 0n)
    throw new Error(
      `Attempted to encode -0x${n.toString(16).slice(1)} into an EVM ${
        e.type
      }, but you cannot encode negative numbers into a ${e.type}.`
    );
  return { isDynamic: !1, bytes: D(y(n, r)) };
}
function K(e) {
  if (!/^u?fixed\d+x\d+$/.test(e.type)) return null;
  throw new Error(`Encoding into EVM type ${e.type} is not supported`);
}
function Q(e) {
  if (e.type !== "function") return null;
  throw new Error(`Encoding into EVM type ${e.type} is not supported`);
}
function X(e) {
  let n = e.length % 32 ? e.length + 32 - (e.length % 32) : e.length,
    t = new Uint8Array(n);
  return t.set(e, t.length - e.length), t;
}
function D(e) {
  let n = e.length % 32 ? e.length + 32 - (e.length % 32) : e.length,
    t = new Uint8Array(n);
  return t.set(e, 0), t;
}
function p(e) {
  return new Uint8Array(e.flatMap((n) => [...n]));
}
function B(e) {
  let n = e.length,
    t = D(e);
  return p([y(n), t]);
}
function g(e) {
  let n = 0;
  for (let o of e) o.isDynamic ? (n += 32) : (n += o.bytes.length);
  let t = [],
    r = [];
  for (let o of e)
    if (o.isDynamic) {
      let i = r.reduce((u, s) => (u += s.length), 0);
      t.push(y(n + i)), r.push(o.bytes);
    } else t.push(o.bytes);
  return p([...t, ...r]);
}
function N(e) {
  for (let n of e) if (x(n)) return !0;
  return !1;
}
function x(e) {
  if (e.type === "string" || e.type === "bytes" || e.type.endsWith("[]"))
    return !0;
  let n = /^(.*)\[(\d+)\]$/.exec(e.type);
  return !!(
    (n !== null && x(Object.assign({}, e, { type: n[1] }))) ||
    (e.type === "tuple" && N(e.components || []))
  );
}
function Y(e) {
  return Array.isArray(e);
}
function a(e, n = !1) {
  return n ? ee(e) : I(e);
}
function y(e, n = 32, t = !1) {
  return t ? ne(e, n) : v(e, n);
}
function I(e) {
  let n = 0n;
  for (let t of e) n = (n << 8n) + BigInt(t);
  return n;
}
function ee(e) {
  let n = I(e);
  return R(n, e.length * 8);
}
function v(e, n = 32) {
  typeof e == "number" && (e = BigInt(e));
  let t = n * 8;
  if (e >= 2n ** BigInt(t) || e < 0n)
    throw new Error(`Cannot fit ${e} into a ${t}-bit unsigned integer.`);
  let r = new Uint8Array(n);
  for (let o = 0; o < n; ++o)
    r[o] = Number((e >> BigInt(t - o * 8 - 8)) & 0xffn);
  return r;
}
function ne(e, n = 32) {
  typeof e == "number" && (e = BigInt(e));
  let t = n * 8;
  if (e >= 2n ** (BigInt(t) - 1n) || e < -(2n ** (BigInt(t) - 1n)))
    throw new Error(`Cannot fit ${e} into a ${t}-bit signed integer.`);
  let r = R(e, t);
  return v(r);
}
function R(e, n) {
  let t = 2n ** (BigInt(n) - 1n) - 1n;
  return (e & t) - (e & ~t);
}
function te({ to: e, data: n }) {
  let t = new Headers();
  t.append("Content-Type", "application/json");
  let r = JSON.stringify({
    method: "eth_call",
    params: [{ from: null, to: e, data: n }, "latest"],
    id: 1,
    jsonrpc: "2.0",
  });
  return { method: "POST", headers: t, body: r, redirect: "follow" };
}
function re(e) {
  let n = "";
  for (let t = 0; t < e.length; t += 2) {
    let r = parseInt(e.substring(t, t + 2), 16);
    r && (n += String.fromCharCode(r));
  }
  return n.slice(2);
}
function oe(e) {
  return [...new Uint8Array(e)]
    .map((n) => n.toString(16).padStart(2, "0"))
    .join("");
}
function ie(e) {
  let n = /^(?:0x)?([a-fA-F0-9]*)$/.exec(e);
  if (!n)
    throw new Error(
      "Error while converting hex to Uint8Array - match is undefined"
    );
  let t = n[1];
  if (!t)
    throw new Error(
      "Error while converting hex to Uint8Array - normalized is undefined"
    );
  let r = [];
  for (let i = 0; i < t.length; i += 2)
    r.push(Number.parseInt(`${t[i]}${t[i + 1]}`, 16));
  let o = new Uint8Array(r.length);
  return o.set(r, 0), o;
}
var m = {
    RNSReverseRegistrar_computedId: {
      inputs: [{ internalType: "address", name: "addr", type: "address" }],
      name: "computeId",
      outputs: [{ internalType: "uint256", name: "id", type: "uint256" }],
      stateMutability: "pure",
      type: "function",
    },
    publicResolver_name: {
      inputs: [{ internalType: "bytes32", name: "node", type: "bytes32" }],
      name: "name",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      stateMutability: "view",
      type: "function",
    },
    publicResolver_addr: {
      inputs: [{ internalType: "bytes32", name: "node", type: "bytes32" }],
      name: "addr",
      outputs: [{ internalType: "address payable", name: "", type: "address" }],
      stateMutability: "view",
      type: "function",
    },
    RNSUnified_namehash: {
      inputs: [{ internalType: "string", name: "str", type: "string" }],
      name: "namehash",
      outputs: [{ internalType: "bytes32", name: "hashed", type: "bytes32" }],
      stateMutability: "pure",
      type: "function",
    },
  },
  b = {
    RNSReverseRegistrar: "0xb8618a73cc08d2c4097d5c0e0f32fa4af4547e2f",
    publicResolver: "0xadb077d236d9e81fb24b96ae9cb8089ab9942d48",
    RNSUnified: "0x67c409dab0ee741a1b1be874bd1333234cfdbf44",
  };
async function w({
  hexFunction: e,
  RPCUrl: n,
  input: t,
  ABIParams: r,
  address: o,
}) {
  let i = A(r, [t]),
    u = te({ to: o, data: e + oe(i) }),
    s = await fetch(n, u),
    c = JSON.parse(await s.text());
  return !c || !c.result ? null : c.result;
}
async function se(e, n) {
  let t = n ?? "https://api.roninchain.com/rpc",
    r = e;
  e.includes("ronin:") && (r = "0x" + e.slice(6));
  try {
    let o = await w({
      hexFunction: "0xd472ad04",
      RPCUrl: t,
      input: BigInt(r),
      ABIParams: m.RNSReverseRegistrar_computedId.inputs,
      address: b.RNSReverseRegistrar,
    });
    if (!o) throw new Error("response is undefined - calling RNS Unified");
    let i = await w({
      hexFunction: "0x691f3431",
      RPCUrl: t,
      input: BigInt(o),
      ABIParams: m.publicResolver_name.inputs,
      address: b.publicResolver,
    });
    return i && re(i);
  } catch (o) {
    console.error(o);
  }
}
async function ue(e, n) {
  let t = n ?? "https://api.roninchain.com/rpc";
  try {
    let r = await w({
      hexFunction: "0x09879962",
      RPCUrl: t,
      input: e,
      ABIParams: m.RNSUnified_namehash.inputs,
      address: b.RNSUnified,
    });
    if (!r) throw new Error("response is undefined - calling RNS Unified");
    let o = await w({
      hexFunction: "0x3b3b57de",
      RPCUrl: t,
      input: BigInt(r),
      ABIParams: m.publicResolver_addr.inputs,
      address: b.publicResolver,
    });
    return (
      o && "0x" + S(m.publicResolver_addr.outputs, ie(o)).result?.toString(16)
    );
  } catch (r) {
    console.error(r);
  }
}
function le(e) {
  return {
    getName: (n) => se(n, e),
    getAddr: (n) => ue(n, e),
    getBalance: (n) => ce(n, e),
  };
}
async function ce(e, n, t = 2) {
  let r = n ?? "https://api.roninchain.com/rpc",
    o = e;
  e.includes("ronin:") && (o = "0x" + e.slice(6));
  try {
    let i = new Headers();
    i.append("Content-Type", "application/json");
    let u = JSON.stringify({
        jsonrpc: "2.0",
        id: 0,
        method: "eth_getBalance",
        params: [o, "latest"],
      }),
      s = await fetch(r, {
        method: "POST",
        headers: i,
        body: u,
        redirect: "follow",
      }),
      c = JSON.parse(await s.text())?.result,
      d = BigInt(c) / BigInt(10 ** (18 - t));
    return Number(d) / 10 ** t;
  } catch (i) {
    console.error(i);
  }
}
export { ue as getAddr, ce as getBalance, se as getName, le as initRNS };
