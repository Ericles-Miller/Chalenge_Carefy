export class CheckTokens {
  private invalidTokens: Set<string> = new Set();

  invalidateToken(sessionId: string) {
    this.invalidTokens.add(sessionId);
  }

  isTokenInvalid(sessionId: string): boolean {
    return this.invalidTokens.has(sessionId);
  }
}
