// timeToMs.test.ts
import { timeToMs } from "./time" // Adjust the import path as needed

describe("Utils: Time", () => {
  describe("timeToMs", () => {
    it("should convert seconds correctly", () => {
      expect(timeToMs("10s")).toBe(10 * 1000)
    })

    it("should convert minutes correctly", () => {
      expect(timeToMs("5m")).toBe(5 * 60 * 1000)
    })

    it("should convert hours correctly", () => {
      expect(timeToMs("2h")).toBe(2 * 60 * 60 * 1000)
    })

    it("should convert days correctly", () => {
      expect(timeToMs("3d")).toBe(3 * 24 * 60 * 60 * 1000)
    })

    it("should convert weeks correctly", () => {
      expect(timeToMs("1w")).toBe(7 * 24 * 60 * 60 * 1000)
    })

    it("should convert years correctly", () => {
      expect(timeToMs("1y")).toBe(365 * 24 * 60 * 60 * 1000)
    })

    it("should throw an error for invalid format", () => {
      expect(() => timeToMs("10")).toThrow("Invalid time format: 10")
      expect(() => timeToMs("abc")).toThrow("Invalid time format: abc")
      expect(() => timeToMs("10x")).toThrow("Invalid time format: 10x")
      expect(() => timeToMs("")).toThrow("Invalid time format: ")
    })

    it("should handle edge case with zero value", () => {
      expect(timeToMs("0s")).toBe(0)
    })
  })
})
