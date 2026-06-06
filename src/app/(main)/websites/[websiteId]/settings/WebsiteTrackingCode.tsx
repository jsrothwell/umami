import { Column, Label, Text, TextField } from '@umami/react-zen';
import { useMessages } from '@/components/hooks';

export function WebsiteTrackingCode({
  websiteId,
  hostUrl,
}: {
  websiteId: string;
  hostUrl?: string;
}) {
  const { t, labels } = useMessages();

  const origin =
    typeof window !== 'undefined' ? window.location.origin : hostUrl || '';

  const swiftScreenView = `// Screen view (call on each screen appear)
func trackScreen(_ name: String) {
    let body: [String: Any] = [
        "type": "event",
        "payload": [
            "website": "${websiteId}",
            "url": "/\\(name.lowercased().replacingOccurrences(of: " ", with: "-"))",
            "os": UIDevice.current.systemName + " " + UIDevice.current.systemVersion,
            "device": UIDevice.current.model,
        ]
    ]
    sendToUmami(body)
}

// Custom event (e.g. button tap, purchase)
func trackEvent(_ name: String, properties: [String: Any] = [:]) {
    let body: [String: Any] = [
        "type": "event",
        "payload": [
            "website": "${websiteId}",
            "name": name,
            "data": properties,
            "os": UIDevice.current.systemName + " " + UIDevice.current.systemVersion,
            "device": UIDevice.current.model,
        ]
    ]
    sendToUmami(body)
}

// Send helper
func sendToUmami(_ body: [String: Any]) {
    guard let url = URL(string: "${origin}/api/send") else { return }
    var request = URLRequest(url: url)
    request.httpMethod = "POST"
    request.setValue("application/json", forHTTPHeaderField: "Content-Type")
    request.httpBody = try? JSONSerialization.data(withJSONObject: body)
    URLSession.shared.dataTask(with: request).resume()
}`;

  return (
    <Column gap>
      <Label>Swift App Integration</Label>
      <Text color="muted">
        Use the Umami API directly from your Swift app. Copy the helpers below into your app — set
        your website ID once and call <code>trackScreen</code> / <code>trackEvent</code> anywhere.
      </Text>
      <Text color="muted" size="sm">
        Tip: pass <code>browser: "AppName/1.0"</code> in the payload to track your app version in
        the Environment panel.
      </Text>
      <TextField
        value={swiftScreenView}
        isReadOnly
        allowCopy
        asTextArea
        resize="none"
        className="code-textarea"
      />
    </Column>
  );
}
