/**
 * Ambitum Geología y Ambiente - 3D Terrain Animation
 * Wireframe topographic mesh with elegant thin contour lines.
 */

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.createElement('canvas');
    canvas.className = 'global-canvas';
    document.body.insertBefore(canvas, document.body.firstChild);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 35, 70);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // ========== PRIMARY TERRAIN MESH ==========
    const width = 200;
    const depth = 200;
    const segments = 55;
    const geometry = new THREE.PlaneGeometry(width, depth, segments, segments);
    geometry.rotateX(-Math.PI / 2);

    const position = geometry.attributes.position;
    const originalX = new Float32Array(position.count);
    const originalZ = new Float32Array(position.count);
    for (let i = 0; i < position.count; i++) {
        originalX[i] = position.getX(i);
        originalZ[i] = position.getZ(i);
    }

    for (let i = 0; i < position.count; i++) {
        const x = originalX[i];
        const z = originalZ[i];
        const y = Math.sin(x * 0.04) * Math.cos(z * 0.04) * 10 +
                  Math.sin(x * 0.1) * Math.cos(z * 0.1) * 3 +
                  Math.sin(x * 0.2) * 1;
        position.setY(i, y);
    }
    geometry.computeVertexNormals();

    const material = new THREE.MeshBasicMaterial({
        color: 0xe74011,
        wireframe: true,
        transparent: true,
        opacity: 0.18
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.y = -15;
    scene.add(mesh);

    // ========== GHOST MESH (depth layer) ==========
    const ghostGeometry = geometry.clone();
    const ghostMaterial = new THREE.MeshBasicMaterial({
        color: 0xe74011,
        wireframe: true,
        transparent: true,
        opacity: 0.06
    });
    const ghostMesh = new THREE.Mesh(ghostGeometry, ghostMaterial);
    ghostMesh.position.y = -22;
    ghostMesh.scale.set(1.2, 1, 1.2);
    scene.add(ghostMesh);

    // ========== ELEGANT THIN CONTOUR LINES ==========
    const contourGroup = new THREE.Group();
    const contourData = [
        { radius: 16,  height: -7,  opacity: 0.35 },
        { radius: 25,  height: -5,  opacity: 0.30 },
        { radius: 34,  height: -3,  opacity: 0.26 },
        { radius: 43,  height: -1,  opacity: 0.22 },
        { radius: 52,  height:  1,  opacity: 0.20 },
        { radius: 62,  height:  3,  opacity: 0.17 },
        { radius: 73,  height:  5,  opacity: 0.14 },
        { radius: 85,  height:  7,  opacity: 0.11 },
        { radius: 97,  height:  9,  opacity: 0.08 },
    ];

    contourData.forEach((data, c) => {
        const curvePoints = [];
        const pointCount = 160;

        for (let i = 0; i <= pointCount; i++) {
            const angle = (i / pointCount) * Math.PI * 2;
            const rx = data.radius * (1 + 0.12 * Math.sin(angle * 3 + c * 1.1));
            const rz = data.radius * 0.82 * (1 + 0.08 * Math.cos(angle * 5 - c * 0.6));
            const x = Math.cos(angle) * rx;
            const z = Math.sin(angle) * rz;
            const y = data.height + Math.sin(angle * 2 + c) * 0.6;
            curvePoints.push(new THREE.Vector3(x, y, z));
        }

        const curve = new THREE.CatmullRomCurve3(curvePoints, true);
        const points = curve.getPoints(200);
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);

        // Soft silver-blue color — contrasts elegantly with the orange wireframe
        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0x8ec8e8,
            transparent: true,
            opacity: data.opacity,
        });

        const contourLine = new THREE.Line(lineGeometry, lineMaterial);
        contourGroup.add(contourLine);
    });

    contourGroup.position.y = -15;
    scene.add(contourGroup);

    // ========== MOUSE & SCROLL ==========
    let targetMouseX = 0;
    let targetMouseY = 0;
    let mouseX = 0;
    let mouseY = 0;

    window.addEventListener('mousemove', (e) => {
        targetMouseX = (e.clientX - window.innerWidth / 2) / 300;
        targetMouseY = (e.clientY - window.innerHeight / 2) / 300;
    });

    let scrollPercent = 0;
    window.addEventListener('scroll', () => {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (scrollHeight > 0) {
            scrollPercent = window.scrollY / scrollHeight;
        }
    }, { passive: true });

    // ========== ANIMATION LOOP ==========
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);

        const t = clock.getElapsedTime();

        mouseX += (targetMouseX - mouseX) * 0.04;
        mouseY += (targetMouseY - mouseY) * 0.04;

        // Main mesh
        mesh.rotation.y = t * 0.008 + mouseX * 0.5 + scrollPercent * 1.5;
        mesh.rotation.x = -0.15 + mouseY * 0.3 - scrollPercent * 0.2;
        mesh.position.y = -15 + scrollPercent * 12;

        // Ghost mesh
        ghostMesh.rotation.y = t * 0.005 + mouseX * 0.3 + scrollPercent * 1.2;
        ghostMesh.rotation.x = -0.12 + mouseY * 0.2 - scrollPercent * 0.15;
        ghostMesh.position.y = -22 + scrollPercent * 8;

        // Contour rings
        contourGroup.rotation.y = t * 0.007 + mouseX * 0.45 + scrollPercent * 1.4;
        contourGroup.rotation.x = -0.15 + mouseY * 0.28 - scrollPercent * 0.19;
        contourGroup.position.y = -15 + scrollPercent * 11;

        // Gentle contour undulation
        contourGroup.children.forEach((line, idx) => {
            const posAttr = line.geometry.attributes.position;
            for (let i = 0; i < posAttr.count; i++) {
                const baseY = contourData[idx].height + Math.sin((i / posAttr.count) * Math.PI * 4 + idx) * 0.6;
                const wave = Math.sin(t * 0.3 + idx * 0.8 + i * 0.04) * 0.4;
                posAttr.setY(i, baseY + wave);
            }
            posAttr.needsUpdate = true;
        });

        // Terrain morph
        const pos = geometry.attributes.position;
        for (let i = 0; i < pos.count; i++) {
            const x = originalX[i];
            const z = originalZ[i];
            const wave1 = Math.sin(x * 0.04 + t * 0.12) * Math.cos(z * 0.04 + t * 0.12) * 8;
            const wave2 = Math.cos(x * 0.08 - t * 0.08) * 3;
            const wave3 = Math.sin(x * 0.15 + t * 0.05) * Math.sin(z * 0.12 - t * 0.06) * 1.5;
            pos.setY(i, wave1 + wave2 + wave3 - 5);
        }
        pos.needsUpdate = true;
        geometry.computeVertexNormals();

        renderer.render(scene, camera);
    }

    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
});
