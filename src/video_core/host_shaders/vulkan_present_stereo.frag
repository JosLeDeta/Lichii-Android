// SPDX-License-Identifier: GPL-2.0-or-later

#version 460 core

layout (location = 0) in vec2 frag_tex_coord;
layout (location = 1) flat in int stereo_view;
layout (location = 0) out vec4 color;

layout (binding = 0) uniform sampler2D color_texture;
layout (binding = 1) uniform sampler2D depth_texture;

void main() {
    vec2 uv = frag_tex_coord;
    if (stereo_view != 0) {
        float depth = texture(depth_texture, uv).r;
        if (stereo_view >= 3) {
            depth = 1.0 - depth;
        }
        if (depth >= 0.0 && depth <= 1.0) {
            // Put the far plane at the screen and cap the horizontal disparity.
            float near_weight = pow(1.0 - depth, 0.35);
            float eye_direction = (stereo_view & 1) != 0 ? -1.0 : 1.0;
            float edge_fade = smoothstep(0.0, 0.025, min(uv.x, 1.0 - uv.x));
            uv.x += eye_direction * 0.004 * near_weight * edge_fade;
        }
    }
    color = texture(color_texture, uv);
}
