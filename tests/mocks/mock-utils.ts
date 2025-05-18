class MockTagGenerator {
  private static lastGeneratedTags: Map<string, string> = new Map();

  static generateUniqueTag(namespace: string): string {
    const tag = Math.random().toString(36).substring(2, 8);
    this.lastGeneratedTags.set(namespace, tag);
    return tag;
  }

  static getLastGeneratedTag(namespace: string): string {
    return this.lastGeneratedTags.get(namespace) || "";
  }
}

export const mockUtils = {
  generateTag: (namespace: string) =>
    MockTagGenerator.generateUniqueTag(namespace),
  getLastTag: (namespace: string) =>
    MockTagGenerator.getLastGeneratedTag(namespace),
};
