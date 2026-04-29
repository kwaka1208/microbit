# **Telemetry System \- 取扱説明書**

このシステムは、Web Serial APIを利用してブラウザ上で動作する車のテレメトリー（遠隔情報収集）ダッシュボードです。micro:bitなどのマイコンとUSBのシリアル通信で接続し、センサー情報の可視化、ラップタイムの計測、エンジン（システム）の制御を行うことができます。

![](top.png)

## **動作環境**

* **ブラウザ**: Google Chrome または Microsoft Edge (Web Serial APIに対応している必要があります)  
* **ハードウェア**: micro:bit (USBケーブルでPCに接続)

## **Webシステムの使い方**

### **1\. 接続 (CONNECT)**

1. micro:bitをUSBケーブルでPCに接続します。  
2. 画面右上の「CONNECT（接続）」ボタンをクリックします。  
3. ブラウザのポップアップが表示されるので、「mbed Serial Port」または「BBC micro:bit CMSIS-DAP」などを選択して「接続」を押します。  
4. 接続に成功するとステータスが「CONNECTED」になり、LEDアイコンが緑色に点灯します。

*(ここに接続時のポップアップやボタン部分のスクリーンショットを追加)*

### **2\. ダッシュボード設定 (DASHBOARD CONFIG)**

受信したデータを画面中央のメーターとして表示するためには、あらかじめ項目を登録しておく必要があります。（デフォルトでspdが登録されています）

1. 左側の「DASHBOARD CONFIG」パネルの **KEY (RX)** に、micro:bitから送られてくるデータのキー名（例: tmp）を入力します。  
2. **DISPLAY NAME** に、画面に表示したい名前（例: 温度）を入力します。  
3. 「ADD ITEM（追加）」ボタンを押します。

*(ここにダッシュボード設定パネルのスクリーンショットを追加)*

### **3\. エンジン制御とラップタイム (ENGINE & LAPS)**

1. 「START」ボタンを押すと内部のタイマーが動き出し、計測（セッション）が開始されます。同時にmicro:bitに eng:1 が送信されます。  
2. micro:bitから lap:任意の値 というデータを受信すると、その時点のラップタイムと合計時間が右側の「LAP TIMES」パネルに記録されます。  
3. 「STOP」ボタンでタイマーが停止し、micro:bitに eng:0 が送信されます。（再度STARTを押すとリセットされます）

*(ここに動いているタイマーとラップタイム一覧のスクリーンショットを追加)*

## **micro:bit側のプログラム作成方法**

ブラウザとmicro:bitは、**改行コード(\\n)区切りの文字列**で通信します。

フォーマットは常に **キー:値** の形式です。

### **通信プロトコル（仕様）**

| **方向** | **フォーマット** | **説明** |

| **PC → micro:bit** | eng:1 | エンジンスタート（計測開始） |

| **PC → micro:bit** | eng:0 | エンジンストップ（計測終了） |

| **PC → micro:bit** | inq:all | 現在の全ステータスを要求 |

| **micro:bit → PC** | lap:\<値\> | ラップ通過を通知（値は任意の数値, 例: lap:1） |

| **micro:bit → PC** | \<キー\>:\<値\> | カスタムデータ（例: spd:50, tmp:26 など。キーは基本的に3文字） |

### **MakeCodeでの利用例**

Microsoft MakeCode for micro:bit を使ってプログラムを作成する場合の例です。

- [PC側：telementry-client](https://makecode.microbit.org/S67601-05149-79223-33048)
- [車側：cat-control]()


#### **1\. micro:bitからブラウザへ (TX)**

シリアル通信で1行書き出すブロックを使用します。

例えば、スピードの値を送る場合は シリアル通信 通信あて先\[USB\] 1行書き出す\["spd:" と (スピードの変数) を繋げる\] のようにします。

```javascript
// MakeCode JavaScriptの例：1秒ごとにスピード(spd)の値を送信する  
basic.forever(function () {  
    let currentSpeed \= input.acceleration(Dimension.X); // 例として加速度を使用  
    serial.writeLine("spd:" \+ currentSpeed);  
    basic.pause(1000);  
});

// Aボタンを押したときにラップを送信する  
input.onButtonPressed(Button.A, function () {  
    serial.writeLine("lap:btn");  
});
```
`
#### **2\. ブラウザからデータを受け取る (RX)**

シリアル通信で改行(\\n)まで読み取り、文字列を分割（スプリット）して処理します。

```javascript
// MakeCode JavaScriptの例：PCからのコマンドを受信する  
serial.onDataReceived(serial.delimiters(Delimiters.NewLine), function () {  
    // 1行読み込む  
    let receivedString \= serial.readUntil(serial.delimiters(Delimiters.NewLine));  
      
    // ":" が含まれているか確認（MakeCodeのブロックでは「文字が見つかる位置」等を使用）  
    if (receivedString.includes(":")) {  
        // "eng" と "1" のように分割する処理のイメージ  
        // (MakeCodeの標準ブロックでは少し工夫が必要ですが、拡張機能のテキスト操作を使うと簡単です)  
          
        if (receivedString \== "eng:1") {  
            basic.showIcon(IconNames.Yes); // エンジンスタート  
        } else if (receivedString \== "eng:0") {  
            basic.showIcon(IconNames.No);  // エンジンストップ  
        } else if (receivedString \== "inq:all") {  
            // ステータス要求が来たら現在の状態をすべて送信する  
            serial.writeLine("spd:0");  
            serial.writeLine("tmp:" \+ input.temperature());  
        }  
    }  
});
```

*(ここにMakeCodeのブロックを組んだ画面のスクリーンショットを追加)*

### **開発のヒント**

* **カスタムコマンド**: Web画面左下の「CUSTOM CMD」を使うと、任意のキーと値を手動でmicro:bitに送ることができます。プログラムのデバッグ時に便利です。  
* **送受信ログ**: 画面右下の「TX/RX LOG」には、実際のシリアル通信の生データが流れます。想定通りに文字が送受信できているかここで確認してください。
