import ContentSection from '../components/content-section'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'

export default function Profile() {

    return (
        <ContentSection
            title="Profile"
            desc="Update your profile details, adjust your security settings, and find your referral code here."
        >
            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-medium">Your personal information</h3>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Full name</Label>
                        <Input id="name" value="John Doe" readOnly />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" value="john.doe@example.com" readOnly />
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-medium">Referral Code</h3>
                    <p className="text-sm text-muted-foreground">
                        This is your referral code that you may share with your friends.
                        <span className="text-sm text-muted-foreground">
                            Your referral code is: <span className="font-bold">ABC123</span>
                        </span>
                    </p>
                </div>

                <div>
                    <h3 className="text-lg font-medium">Mobile settings</h3>
                    <p className="text-sm text-muted-foreground">
                        Register your phone number to add greater security to your account.
                        <span className="text-sm text-muted-foreground">
                            Your current phone number is: <span className="font-bold">+1234567890</span>
                            <Button variant="link" size="sm">Change</Button>
                        </span>
                    </p>
                    <div className="flex items-center space-x-4">
                        <div>
                            <div className="grid gap-2">
                                <Label htmlFor="profile-picture">Profile picture</Label>
                                <Input id="profile-picture" type="file" />
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-medium">Change password</h3>
                    <span className="text-sm text-muted-foreground">
                        Enter your current password and your new password to change it.
                    </span>
                    <div className="grid gap-2">
                        <Label htmlFor="current">Current password</Label>
                        <Input id="current" type="password" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="new">New password</Label>
                        <Input id="new" type="password" />
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-medium">Additional security</h3>
                    <span className="text-sm text-muted-foreground">
                    </span>
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="text-sm font-medium">PIN</h4>
                            <p className="text-sm text-muted-foreground">
                                Required to allow fund transfers like withdrawal, batch disbursements, or cards refund.
                            </p>
                        </div>
                        <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="text-sm font-medium">2-factor Authentication</h4>
                            <p className="text-sm text-muted-foreground">
                                Require a security key in addition to your password
                            </p>
                        </div>
                        <Switch />
                    </div>
                </div>
            </div>
        </ContentSection >
    )
}