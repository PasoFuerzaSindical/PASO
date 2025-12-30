
export const sendGlobalAlert = async (webhookUrl: string, title: string, message: string, color: number = 282961) => {
    if (!webhookUrl) return;

    const payload = {
        embeds: [{
            title: `🚨 ALERTA P.A.S.O.: ${title}`,
            description: message,
            color: color,
            timestamp: new Date().toISOString(),
            footer: {
                text: "Monitor de Campaña P.A.S.O."
            }
        }]
    };

    try {
        await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
    } catch (error) {
        console.error("Error sending telemetry:", error);
    }
};
