import * as THREE from "three";

// Loads the seated, pre-rigged character exported to /models/boy/boy.bin:
// [u32 header length][JSON header][u16 positions x3][u16 uvs x2][i8 normals x4][u32 indices][u8 joints x4][u8 weights x4]
export async function loadHuman(url, material) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status}`);
  const buf = await res.arrayBuffer();

  const headerLength = new DataView(buf).getUint32(0, true);
  const header = JSON.parse(new TextDecoder().decode(new Uint8Array(buf, 4, headerLength)).replace(/\0+$/, ""));
  const align4 = (n) => n + ((4 - (n % 4)) % 4);
  const nv = header.vertexCount;

  let offset = 4 + headerLength;
  const qPos = new Uint16Array(buf, offset, nv * 3);
  offset = align4(offset + nv * 6);
  const qUv = new Uint16Array(buf, offset, nv * 2);
  offset = align4(offset + nv * 4);
  const normals = new Int8Array(buf, offset, nv * 4);
  offset += nv * 4;
  const indices = new Uint32Array(buf, offset, header.indexCount);
  offset += header.indexCount * 4;
  const joints = new Uint8Array(buf, offset, nv * 4);
  offset += nv * 4;
  const weights = new Uint8Array(buf, offset, nv * 4);

  const positions = new Float32Array(nv * 3);
  const uvs = new Float32Array(nv * 2);
  const normal = new Float32Array(nv * 3);
  for (let i = 0; i < nv; i++) {
    for (let k = 0; k < 3; k++) {
      positions[i * 3 + k] = header.posMin[k] + qPos[i * 3 + k] * header.posScale[k];
      normal[i * 3 + k] = normals[i * 4 + k] / 127;
    }
    for (let k = 0; k < 2; k++) uvs[i * 2 + k] = header.uvMin[k] + qUv[i * 2 + k] * header.uvScale[k];
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("normal", new THREE.BufferAttribute(normal, 3));
  geometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
  geometry.setIndex(new THREE.BufferAttribute(new Uint32Array(indices), 1));
  geometry.setAttribute("skinIndex", new THREE.Uint8BufferAttribute(new Uint8Array(joints), 4));
  geometry.setAttribute("skinWeight", new THREE.Uint8BufferAttribute(new Uint8Array(weights), 4, true));

  // bones are stored at their seated world positions; rebuild the hierarchy
  const bones = {};
  const list = header.bones.map(({ name, parent, pos }) => {
    const bone = new THREE.Bone();
    bone.name = name;
    bone.rotation.order = "YXZ";
    bone.userData.world = new THREE.Vector3(...pos);
    if (parent) {
      bone.position.copy(bone.userData.world).sub(bones[parent].userData.world);
      bones[parent].add(bone);
    } else {
      bone.position.copy(bone.userData.world);
    }
    bones[name] = bone;
    return bone;
  });

  const mesh = new THREE.SkinnedMesh(geometry, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.frustumCulled = false;
  mesh.add(bones.root);
  mesh.updateMatrixWorld(true);
  mesh.bind(new THREE.Skeleton(list));

  const hands = header.hands.map((h) => ({
    side: h.side === "L" ? 1 : -1,
    palm: new THREE.Vector3(...h.palm),
    tip: new THREE.Vector3(...h.tip),
  }));

  return { mesh, bones, hands, layout: header.layout };
}

// Textured PBR material for the character.
export function loadCharacterMaterial(baseUrl) {
  const loader = new THREE.TextureLoader();
  const map = loader.load(`${baseUrl}/diffuse.jpg`);
  map.colorSpace = THREE.SRGBColorSpace;
  map.anisotropy = 8;
  const normalMap = loader.load(`${baseUrl}/normal.jpg`);
  const roughnessMap = loader.load(`${baseUrl}/roughness.jpg`);
  return new THREE.MeshStandardMaterial({ map, normalMap, roughnessMap, roughness: 1, metalness: 0 });
}
