import UIKit

class NativeBackground: UIView {
  @objc var minLength: Int = 0 {
    didSet { initIfReady() }
  }
  @objc var maxLength: Int = 0 {
    didSet { initIfReady() }
  }
  @objc var minSpeed: Int = 0 {
    didSet { initIfReady() }
  }
  @objc var speedRange: Int = 0 {
    didSet { initIfReady() }
  }
  @objc var laserColors: NSArray = [] {
    didSet { initIfReady() }
  }
  @objc var minThickness: Int = 0 {
    didSet { initIfReady() }
  }
  @objc var maxThickness: Int = 0 {
    didSet { initIfReady() }
  }
  @objc var maxLasers: Int = 0 {
    didSet { initIfReady() }
  }

  public var width: CGFloat = UIScreen.main.bounds.width
  public var height: CGFloat = UIScreen.main.bounds.height

  private var lasers: [Laser] = []
  private var displayLink: CADisplayLink?
  private var lastFrameTimestamp: CFTimeInterval = 0

  override init(frame: CGRect) {
    super.init(frame: frame)
  }

  required init?(coder: NSCoder) {
    super.init(coder: coder)
  }

  private func startAnimation() {
    displayLink = CADisplayLink(target: self, selector: #selector(update))
    displayLink?.add(to: .current, forMode: .common)
  }

  @objc private func update() {
    let deltaTime = CGFloat(displayLink?.timestamp ?? 0) - CGFloat(lastFrameTimestamp)

    for laser in lasers {
      laser.update(deltaTime: deltaTime)
    }

    lastFrameTimestamp = displayLink?.timestamp ?? 0
    setNeedsDisplay()
  }

  override func draw(_ rect: CGRect) {
    super.draw(rect)

    guard let context = UIGraphicsGetCurrentContext() else { return }

    for laser in lasers {
      laser.draw(in: context)
    }
  }

  private func generateLasers() {
    lasers.removeAll()

    for _ in 0..<maxLasers {
      lasers.append(Laser(nativeBackground: self))
    }
  }

  private func initIfReady() {
    if (minLength > 0 && maxLength > 0 && minSpeed > 0 && speedRange > 0 && laserColors.count > 0 && minThickness > 0 && maxThickness > 0 && maxLasers > 0) {
      generateLasers()
      startAnimation()
    }
  }

  private class Laser {
    var start: CGPoint = CGPoint(x: 0, y: 0)
    var length: Int = 0
    var speed: Int = 0
    var color: UIColor = UIColor.black
    var thickness: CGFloat = 0
    weak var nb: NativeBackground?

    init(nativeBackground: NativeBackground) {
      nb = nativeBackground
      reset()
    }

    func reset() {
      guard let nb = nb else { return }

      length = Int.random(in: nb.minLength...nb.maxLength) + nb.minLength
      start = CGPoint(x: Int.random(in: 0...(Int(nb.width) + Int(nb.height))) - length - Int(nb.height), y: -length)
      color = UIColor(rgb: nb.laserColors[Int.random(in: 0..<nb.laserColors.count)] as! String)
      speed = Int.random(in: 0...nb.speedRange) + nb.minSpeed
      thickness = interpolateThickness()
    }

    func draw(in context: CGContext) {
      context.setStrokeColor(color.cgColor)
      context.setLineWidth(thickness)
      // context.setShadow(offset: CGSize.zero, blur: 7, color: color.cgColor)
      context.move(to: start)
      context.addLine(to: CGPoint(x: start.x + CGFloat(length), y: start.y + CGFloat(length)))
      context.strokePath()
    }

    func update(deltaTime: CGFloat) {
      guard let nb = nb else { return }

      let distance = CGFloat(speed) * deltaTime * 30
      start = CGPoint(x: start.x + distance, y: start.y + distance)

      if (start.x > nb.width || start.y > nb.height) {
        reset()
      }
    }

    func interpolateThickness() -> CGFloat {
      guard let nb = nb else { return 0 }

      let speedDifference = CGFloat(speed) - CGFloat(nb.minSpeed)
      let normalizedSpeed: CGFloat = speedDifference / CGFloat(nb.speedRange)
      let thicknessDifference: CGFloat = CGFloat(nb.maxThickness - nb.minThickness)
      let thicknessIncrement = normalizedSpeed * thicknessDifference
      let finalThickness = thicknessIncrement + CGFloat(nb.minThickness)

      return finalThickness
    }
  }
}

extension UIColor {
  convenience init(rgb: String) {
    // string is in format: #RRGGBB
    let rgb = UInt32(rgb.replacingOccurrences(of: "#", with: ""), radix: 16)!
    let r = CGFloat((rgb >> 16) & 0xFF) / 255.0
    let g = CGFloat((rgb >> 8) & 0xFF) / 255.0
    let b = CGFloat(rgb & 0xFF) / 255.0
    self.init(red: r, green: g, blue: b, alpha: 1.0)
  }
}

@objc (NativeBackgroundManager)
class NativeBackgroundManager: RCTViewManager {
  override static func requiresMainQueueSetup() -> Bool {
    return true
  }

  override func view() -> UIView! {
    return NativeBackground()
  }
}
