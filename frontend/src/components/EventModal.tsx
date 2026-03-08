import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

interface EventFormData {
    title: string;
    description: string;
    event_date: string;
    location: string;
    total_seats: number;
    banner_url: string;
}

interface EventModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: EventFormData) => void;
    initialData?: EventFormData | null;
    isLoading?: boolean;
    mode: 'create' | 'edit';
}

export function EventModal({
    isOpen,
    onOpenChange,
    onSubmit,
    initialData,
    isLoading,
    mode
}: EventModalProps) {

    const [formData, setFormData] = useState<EventFormData>({
        title: "",
        description: "",
        event_date: new Date().toISOString().slice(0, 16),
        location: "",
        total_seats: 50,
        banner_url: "",
    });

    useEffect(() => {
        if (isOpen) {
            if (initialData && mode === 'edit') {
                setFormData({
                    ...initialData,
                    // Format date for datetime-local input
                    event_date: new Date(initialData.event_date).toISOString().slice(0, 16),
                });
            } else {
                setFormData({
                    title: "",
                    description: "",
                    event_date: new Date().toISOString().slice(0, 16),
                    location: "",
                    total_seats: 50,
                    banner_url: "",
                });
            }
        }
    }, [isOpen, initialData, mode]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'total_seats' ? parseInt(value) || 0 : value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            event_date: new Date(formData.event_date).toISOString(), // Convert back to ISO string for API
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{mode === 'create' ? 'Create New Event' : 'Edit Event'}</DialogTitle>
                    <DialogDescription>
                        {mode === 'create'
                            ? 'Fill in the details for your public club event.'
                            : 'Make changes to your existing event here.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Event Title</Label>
                        <Input
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g. Annual Tech Symposium"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="What will happen at this event?"
                            className="resize-none"
                            rows={3}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="event_date">Date & Time</Label>
                            <Input
                                id="event_date"
                                name="event_date"
                                type="datetime-local"
                                value={formData.event_date}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="total_seats">Total Seats</Label>
                            <Input
                                id="total_seats"
                                name="total_seats"
                                type="number"
                                min="1"
                                value={formData.total_seats}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="e.g. Block A Auditorium"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="banner_url">Banner URL (Optional)</Label>
                        <Input
                            id="banner_url"
                            name="banner_url"
                            type="url"
                            value={formData.banner_url}
                            onChange={handleChange}
                            placeholder="https://example.com/image.jpg"
                        />
                    </div>

                    <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? 'Saving...' : mode === 'create' ? 'Create Event' : 'Save Changes'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
