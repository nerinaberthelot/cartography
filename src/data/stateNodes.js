export const STATE_NODES = ['archaeology', 'architecture', 'experience', 'accessibility', 'information'];

export function isStateNode(id) {
  return STATE_NODES.includes(id);
}
