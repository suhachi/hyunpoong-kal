"use strict";
/**
 * PDF 생성 유틸리티
 * 영수증 PDF 생성
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateReceiptPDF = generateReceiptPDF;
const pdfkit_1 = __importDefault(require("pdfkit"));
const storage_1 = require("@google-cloud/storage");
const storage = new storage_1.Storage();
/**
 * 영수증 PDF 생성
 */
async function generateReceiptPDF(data) {
    const projectId = process.env.GCLOUD_PROJECT || 'hyun-poong';
    // ✅ 실제 버킷 이름 사용: hyun-poong.firebasestorage.app
    const bucketName = process.env.FUNCTIONS_EMULATOR
        ? 'demo.firebasestorage.app'
        : process.env.STORAGE_BUCKET_NAME || `${projectId}.firebasestorage.app`;
    const bucket = storage.bucket(bucketName);
    const filename = `receipts/${data.orderId}.pdf`;
    const file = bucket.file(filename);
    return new Promise((resolve, reject) => {
        try {
            const doc = new pdfkit_1.default({
                size: 'A4',
                margins: { top: 50, bottom: 50, left: 50, right: 50 },
            });
            const stream = file.createWriteStream({
                contentType: 'application/pdf',
                metadata: {
                    contentType: 'application/pdf',
                },
            });
            doc.pipe(stream);
            // 헤더
            doc
                .fontSize(20)
                .font('Helvetica-Bold')
                .text('현풍닭칼국수 영수증', { align: 'center' });
            doc.moveDown();
            // 매장 정보
            doc
                .fontSize(10)
                .font('Helvetica')
                .text(data.storeName, { align: 'center' })
                .text(data.storeAddress, { align: 'center' })
                .text(`전화: ${data.storePhone}`, { align: 'center' });
            doc.moveDown();
            // 주문 정보
            doc
                .fontSize(12)
                .text(`주문번호: ${data.orderNumber}`)
                .text(`주문일시: ${data.orderDate}`)
                .text(`고객명: ${data.customerName}`)
                .text(`연락처: ${data.customerPhone}`);
            doc.moveDown();
            // 구분선
            doc
                .moveTo(50, doc.y)
                .lineTo(550, doc.y)
                .stroke();
            doc.moveDown();
            // 주문 항목
            doc.fontSize(11).font('Helvetica-Bold').text('주문 내역');
            doc.moveDown(0.5);
            data.items.forEach((item) => {
                doc
                    .fontSize(10)
                    .font('Helvetica')
                    .text(`${item.name} x ${item.quantity}개`, 50, doc.y, { width: 350, continued: true })
                    .text(`${item.subtotal.toLocaleString()}원`, { align: 'right' });
            });
            doc.moveDown();
            // 구분선
            doc
                .moveTo(50, doc.y)
                .lineTo(550, doc.y)
                .stroke();
            doc.moveDown();
            // 금액 합계
            const addAmountLine = (label, amount, bold = false) => {
                doc
                    .fontSize(10)
                    .font(bold ? 'Helvetica-Bold' : 'Helvetica')
                    .text(label, 50, doc.y, { width: 350, continued: true })
                    .text(`${amount.toLocaleString()}원`, { align: 'right' });
            };
            addAmountLine('주문 금액', data.itemsTotal);
            addAmountLine('배달비', data.deliveryFee);
            if (data.discount > 0) {
                addAmountLine('할인', -data.discount);
            }
            doc.moveDown();
            // 총 결제금액
            doc
                .fontSize(14)
                .font('Helvetica-Bold')
                .text('총 결제금액', 50, doc.y, { width: 350, continued: true })
                .text(`${data.finalAmount.toLocaleString()}원`, { align: 'right' });
            doc.moveDown();
            // 결제수단
            doc
                .fontSize(10)
                .font('Helvetica')
                .text(`결제수단: ${data.paymentMethod}`);
            doc.moveDown(2);
            // 구분선
            doc
                .moveTo(50, doc.y)
                .lineTo(550, doc.y)
                .stroke();
            doc.moveDown();
            // 개발사 정보 (하단)
            doc
                .fontSize(8)
                .font('Helvetica')
                .text('시스템 개발', { align: 'center' })
                .text(`${data.developerInfo.company} | 사업자번호: ${data.developerInfo.bizNo}`, { align: 'center' })
                .text(`대표: ${data.developerInfo.ceo}`, { align: 'center' });
            doc.end();
            stream.on('finish', async () => {
                try {
                    // 서명된 URL 생성 (10분 유효)
                    const [url] = await file.getSignedUrl({
                        action: 'read',
                        expires: Date.now() + 10 * 60 * 1000,
                    });
                    resolve(url);
                }
                catch (error) {
                    reject(error);
                }
            });
            stream.on('error', reject);
        }
        catch (error) {
            reject(error);
        }
    });
}
