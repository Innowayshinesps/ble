<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BLE Alert Sender</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }

        .container {
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            padding: 40px;
            max-width: 500px;
            width: 100%;
        }

        h1 {
            color: #333;
            margin-bottom: 10px;
            font-size: 28px;
        }

        .subtitle {
            color: #666;
            margin-bottom: 30px;
            font-size: 14px;
        }

        .status {
            padding: 12px 20px;
            border-radius: 10px;
            margin-bottom: 20px;
            font-size: 14px;
            font-weight: 500;
        }

        .status.disconnected {
            background: #fee;
            color: #c33;
            border: 1px solid #fcc;
        }

        .status.connected {
            background: #efe;
            color: #3c3;
            border: 1px solid #cfc;
        }

        .status.connecting {
            background: #ffeaa7;
            color: #d63031;
            border: 1px solid #fdcb6e;
        }

        button {
            width: 100%;
            padding: 15px;
            border: none;
            border-radius: 10px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-bottom: 15px;
        }

        button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .btn-primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }

        .btn-primary:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(102, 126, 234, 0.4);
        }

        .btn-danger {
            background: #ff6b6b;
            color: white;
        }

        .btn-danger:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(255, 107, 107, 0.4);
        }

        .btn-secondary {
            background: #95a5a6;
            color: white;
        }

        .btn-secondary:hover:not(:disabled) {
            background: #7f8c8d;
        }

        .form-group {
            margin-bottom: 20px;
        }

        label {
            display: block;
            margin-bottom: 8px;
            color: #333;
            font-weight: 600;
            font-size: 14px;
        }

        input, select, textarea {
            width: 100%;
            padding: 12px 15px;
            border: 2px solid #e0e0e0;
            border-radius: 10px;
            font-size: 14px;
            transition: border-color 0.3s ease;
        }

        input:focus, select:focus, textarea:focus {
            outline: none;
            border-color: #667eea;
        }

        textarea {
            resize: vertical;
            min-height: 100px;
            font-family: inherit;
        }

        .alert-section {
            display: none;
        }

        .alert-section.show {
            display: block;
        }

        .device-info {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 10px;
            margin-bottom: 20px;
        }

        .device-info p {
            margin: 5px 0;
            font-size: 13px;
            color: #555;
        }

        .device-info strong {
            color: #333;
        }

        .accounts-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
            gap: 10px;
            margin-bottom: 20px;
        }

        .account-btn {
            padding: 20px;
            background: white;
            border: 2px solid #667eea;
            border-radius: 10px;
            cursor: pointer;
            transition: all 0.3s ease;
            text-align: center;
        }

        .account-btn:hover {
            background: #667eea;
            color: white;
            transform: translateY(-2px);
        }

        .account-btn .name {
            font-weight: 600;
            font-size: 16px;
            display: block;
        }

        .account-btn .username {
            font-size: 12px;
            color: #666;
            margin-top: 5px;
        }

        .account-btn:hover .username {
            color: rgba(255, 255, 255, 0.8);
        }

        .loading {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 3px solid rgba(255,255,255,.3);
            border-radius: 50%;
            border-top-color: white;
            animation: spin 1s ease-in-out infinite;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        .error-message {
            background: #fee;
            color: #c33;
            padding: 12px;
            border-radius: 8px;
            margin-bottom: 15px;
            font-size: 14px;
            border: 1px solid #fcc;
        }

        .success-message {
            background: #efe;
            color: #3c3;
            padding: 12px;
            border-radius: 8px;
            margin-bottom: 15px;
            font-size: 14px;
            border: 1px solid #cfc;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚨 BLE Alert Sender</h1>
        <p class="subtitle">Send emergency alerts via Bluetooth</p>

        <div id="status" class="status disconnected">
            ⚫ Not Connected
        </div>

        <div id="error-container"></div>
        <div id="success-container"></div>

        <!-- Connection Section -->
        <div id="connection-section">
            <button id="connectBtn" class="btn-primary">
                📱 Connect Nearby Device
            </button>
            <p style="text-align: center; color: #999; font-size: 13px; margin-top: 10px;">
                Make sure Bluetooth is enabled and the receiver app is running
            </p>
        </div>

        <!-- Device Info -->
        <div id="device-info" class="device-info" style="display: none;">
            <p><strong>Device:</strong> <span id="device-name">-</span></p>
            <p><strong>Status:</strong> <span id="connection-status">Connected</span></p>
        </div>

        <!-- Alert Section -->
        <div id="alert-section" class="alert-section">
            <h2 style="margin-bottom: 20px; color: #333; font-size: 20px;">Select Recipient</h2>
            
            <div class="accounts-grid" id="accounts-grid">
                <!-- Account buttons will be dynamically added here -->
            </div>

            <div class="form-group">
                <label for="sender-name">Your Name</label>
                <input type="text" id="sender-name" placeholder="e.g., Surya" value="Surya">
            </div>

            <div class="form-group">
                <label for="alert-message">Alert Message</label>
                <textarea id="alert-message" placeholder="Emergency alert message...">Emergency alert - Need immediate assistance!</textarea>
            </div>

            <button id="sendAlertBtn" class="btn-danger">
                🚨 Send Alert
            </button>

            <button id="disconnectBtn" class="btn-secondary">
                Disconnect
            </button>
        </div>
    </div>

    <script>
        // BLE Configuration
        const BLE_SERVICE_UUID = '12345678-1234-5678-1234-56789abcdef0';
        const BLE_CHARACTERISTIC_UUID = '12345678-1234-5678-1234-56789abcdef1';

        // Predefined accounts (recipients)
        const ACCOUNTS = [
            { name: 'William', username: 'william' },
            { name: 'Sarah', username: 'sarah' },
            { name: 'John', username: 'john' },
            { name: 'Emma', username: 'emma' }
        ];

        // State
        let bleDevice = null;
        let bleCharacteristic = null;
        let selectedRecipient = null;

        // DOM Elements
        const statusDiv = document.getElementById('status');
        const errorContainer = document.getElementById('error-container');
        const successContainer = document.getElementById('success-container');
        const connectBtn = document.getElementById('connectBtn');
        const disconnectBtn = document.getElementById('disconnectBtn');
        const sendAlertBtn = document.getElementById('sendAlertBtn');
        const connectionSection = document.getElementById('connection-section');
        const alertSection = document.getElementById('alert-section');
        const deviceInfo = document.getElementById('device-info');
        const deviceNameSpan = document.getElementById('device-name');
        const accountsGrid = document.getElementById('accounts-grid');
        const senderNameInput = document.getElementById('sender-name');
        const alertMessageInput = document.getElementById('alert-message');

        // Check BLE support
        if (!navigator.bluetooth) {
            showError('Web Bluetooth is not supported in this browser. Please use Chrome, Edge, or Opera.');
            connectBtn.disabled = true;
        }

        // Initialize accounts grid
        function initializeAccounts() {
            accountsGrid.innerHTML = '';
            ACCOUNTS.forEach(account => {
                const btn = document.createElement('div');
                btn.className = 'account-btn';
                btn.innerHTML = `
                    <span class="name">${account.name}</span>
                    <span class="username">@${account.username}</span>
                `;
                btn.onclick = () => selectRecipient(account);
                accountsGrid.appendChild(btn);
            });
        }

        // Select recipient
        function selectRecipient(account) {
            selectedRecipient = account;
            
            // Update UI to show selection
            const allButtons = accountsGrid.querySelectorAll('.account-btn');
            allButtons.forEach(btn => {
                btn.style.background = 'white';
                btn.style.color = '#333';
            });
            
            event.currentTarget.style.background = '#667eea';
            event.currentTarget.style.color = 'white';
            
            showSuccess(`Selected recipient: ${account.name} (@${account.username})`);
        }

        // Show error message
        function showError(message) {
            errorContainer.innerHTML = `<div class="error-message">${message}</div>`;
            setTimeout(() => {
                errorContainer.innerHTML = '';
            }, 5000);
        }

        // Show success message
        function showSuccess(message) {
            successContainer.innerHTML = `<div class="success-message">${message}</div>`;
            setTimeout(() => {
                successContainer.innerHTML = '';
            }, 3000);
        }

        // Update status
        function updateStatus(status, className) {
            statusDiv.textContent = status;
            statusDiv.className = `status ${className}`;
        }

        // Connect to BLE device
        async function connectToDevice() {
            try {
                updateStatus('🔍 Scanning for devices...', 'connecting');
                connectBtn.disabled = true;
                connectBtn.innerHTML = '<span class="loading"></span> Scanning...';

                // Request device
                bleDevice = await navigator.bluetooth.requestDevice({
                    filters: [{
                        services: [BLE_SERVICE_UUID]
                    }],
                    optionalServices: [BLE_SERVICE_UUID]
                });

                console.log('Device selected:', bleDevice.name);
                updateStatus('🔗 Connecting...', 'connecting');

                // Connect to GATT server
                bleDevice.addEventListener('gattserverdisconnected', onDisconnected);
                const server = await bleDevice.gatt.connect();
                console.log('Connected to GATT server');

                // Get service
                const service = await server.getPrimaryService(BLE_SERVICE_UUID);
                console.log('Service found');

                // Get characteristic
                bleCharacteristic = await service.getCharacteristic(BLE_CHARACTERISTIC_UUID);
                console.log('Characteristic found');

                // Update UI
                updateStatus('✅ Connected', 'connected');
                deviceNameSpan.textContent = bleDevice.name || 'Unknown Device';
                deviceInfo.style.display = 'block';
                connectionSection.style.display = 'none';
                alertSection.classList.add('show');
                
                initializeAccounts();
                showSuccess('Successfully connected to device!');

            } catch (error) {
                console.error('Connection failed:', error);
                updateStatus('⚫ Not Connected', 'disconnected');
                connectBtn.disabled = false;
                connectBtn.innerHTML = '📱 Connect Nearby Device';
                
                if (error.name === 'NotFoundError') {
                    showError('No device found. Make sure the receiver app is running and advertising.');
                } else if (error.name === 'SecurityError') {
                    showError('Bluetooth access denied. Please allow Bluetooth permissions.');
                } else {
                    showError(`Connection failed: ${error.message}`);
                }
            }
        }

        // Disconnect handler
        function onDisconnected() {
            console.log('Device disconnected');
            updateStatus('⚫ Disconnected', 'disconnected');
            deviceInfo.style.display = 'none';
            connectionSection.style.display = 'block';
            alertSection.classList.remove('show');
            connectBtn.disabled = false;
            connectBtn.innerHTML = '📱 Connect Nearby Device';
            bleCharacteristic = null;
            bleDevice = null;
            showError('Device disconnected');
        }

        // Manual disconnect
        async function disconnect() {
            if (bleDevice && bleDevice.gatt.connected) {
                await bleDevice.gatt.disconnect();
            }
        }

        // Send alert
        async function sendAlert() {
            if (!selectedRecipient) {
                showError('Please select a recipient first!');
                return;
            }

            if (!bleCharacteristic) {
                showError('Not connected to any device!');
                return;
            }

            const senderName = senderNameInput.value.trim();
            const message = alertMessageInput.value.trim();

            if (!senderName) {
                showError('Please enter your name!');
                return;
            }

            if (!message) {
                showError('Please enter an alert message!');
                return;
            }

            try {
                sendAlertBtn.disabled = true;
                sendAlertBtn.innerHTML = '<span class="loading"></span> Sending...';

                // Create alert payload
                const payload = {
                    type: 'ALERT',
                    to: selectedRecipient.username,
                    from: senderName.toLowerCase(),
                    message: message
                };

                console.log('Sending payload:', payload);

                // Convert to bytes
                const jsonString = JSON.stringify(payload);
                const encoder = new TextEncoder();
                const data = encoder.encode(jsonString);

                // Write to characteristic
                await bleCharacteristic.writeValue(data);

                console.log('Alert sent successfully');
                showSuccess(`Alert sent to ${selectedRecipient.name}! 🚨`);

            } catch (error) {
                console.error('Failed to send alert:', error);
                showError(`Failed to send alert: ${error.message}`);
            } finally {
                sendAlertBtn.disabled = false;
                sendAlertBtn.innerHTML = '🚨 Send Alert';
            }
        }

        // Event listeners
        connectBtn.addEventListener('click', connectToDevice);
        disconnectBtn.addEventListener('click', disconnect);
        sendAlertBtn.addEventListener('click', sendAlert);

        console.log('BLE Alert Sender initialized');
        console.log('Service UUID:', BLE_SERVICE_UUID);
        console.log('Characteristic UUID:', BLE_CHARACTERISTIC_UUID);
    </script>
</body>
</html>