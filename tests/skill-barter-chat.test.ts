import { describe, it, expect } from 'vitest';

describe('SkillBarter Session Chat Attachments & Meeting Links', () => {
  it('should format and parse structured file attachments correctly', () => {
    const attachmentPayload = {
      name: 'database_schema.pdf',
      size: '850 KB',
      type: 'application/pdf',
      dataUrl: 'data:application/pdf;base64,JVBERi0xLjQK...',
      caption: 'PostgreSQL Indexing execution plan',
    };

    const serialized = `[FILE_ATTACHMENT]:${JSON.stringify(attachmentPayload)}`;
    expect(serialized.startsWith('[FILE_ATTACHMENT]:')).toBe(true);

    const parsed = JSON.parse(serialized.replace('[FILE_ATTACHMENT]:', ''));
    expect(parsed.name).toBe('database_schema.pdf');
    expect(parsed.size).toBe('850 KB');
    expect(parsed.type).toBe('application/pdf');
    expect(parsed.caption).toBe('PostgreSQL Indexing execution plan');
  });

  it('should format and parse structured video meeting links with direct URL', () => {
    const meetingPayload = {
      title: 'Live 1:1 Database Systems Session',
      url: 'https://meet.google.com/rvc-dbms-tune',
      platform: 'Google Meet',
      note: 'Click below to join the live video session directly',
    };

    const serialized = `[MEETING_LINK]:${JSON.stringify(meetingPayload)}`;
    expect(serialized.startsWith('[MEETING_LINK]:')).toBe(true);

    const parsed = JSON.parse(serialized.replace('[MEETING_LINK]:', ''));
    expect(parsed.url).toBe('https://meet.google.com/rvc-dbms-tune');
    expect(parsed.platform).toBe('Google Meet');
    expect(parsed.url.startsWith('https://meet.google.com/')).toBe(true);
  });

  it('should detect video meeting links embedded in plain text messages', () => {
    const rawMessage = 'Let us connect on Google Meet right now: https://meet.google.com/abc-defg-hij';
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const match = rawMessage.match(urlRegex);

    expect(match).not.toBeNull();
    expect(match![0]).toBe('https://meet.google.com/abc-defg-hij');
    expect(match![0].includes('meet.google.com')).toBe(true);
  });
});
